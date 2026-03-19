'use client';

/**
 * ScrollDebugPanel — dev-only live scroll diagnostics.
 *
 * Shows real-time measurements of trigger zone, mosaic/exit progress,
 * z-indices, and section positions. Logs snapshots that can be
 * copied with a button and pasted for debugging.
 *
 * Only rendered in development (NODE_ENV check in parent).
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface Snapshot {
  t: number;
  scroll: number;
  mosaic: string;
  exit: string;
  triggerTop: number;
  triggerBot: number;
  triggerH: number;
  canvasTop: number;
  canvasBot: number;
  canvasZ: string;
  canvasTransform: string;
  canvasBg: string;
  colContentBot: number;
  colContentZ: string;
  overlayH: number;
  overlayPadBot: string;
  sections: Array<{
    i: number;
    top: number;
    bot: number;
    z: string;
    bg: string;
    classes: string;
    visible: boolean;
  }>;
  vh: number;
  vw: number;
  dpr: number;
  docH: number;
}

export default function ScrollDebugPanel() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [live, setLive] = useState<Snapshot | null>(null);
  const [recording, setRecording] = useState(false);
  const [copied, setCopied] = useState(false);
  const rafRef = useRef<number | null>(null);

  const measure = useCallback((): Snapshot => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const trigger = document.querySelector('.mosaic-trigger-zone');
    const triggerRect = trigger?.getBoundingClientRect();

    const probe = document.getElementById('three-debug');

    const canvas = document.querySelector('.col-visual');
    const canvasRect = canvas?.getBoundingClientRect();
    const canvasStyle = canvas ? getComputedStyle(canvas) : null;

    const colContent = document.querySelector('.col-content');
    const colContentRect = colContent?.getBoundingClientRect();
    const colContentStyle = colContent ? getComputedStyle(colContent) : null;

    const overlay = document.querySelector('.overlay');
    const overlayRect = overlay?.getBoundingClientRect();
    const overlayStyle = overlay ? getComputedStyle(overlay) : null;

    const sectionEls = document.querySelectorAll('.section, .v2-section');
    const sections = Array.from(sectionEls).map((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const style = getComputedStyle(sec);
      return {
        i,
        top: Math.round(rect.top),
        bot: Math.round(rect.bottom),
        z: style.zIndex,
        bg: style.backgroundColor.substring(0, 30),
        classes: sec.className.replace(/section/g, '').trim(),
        visible: rect.bottom > 0 && rect.top < vh,
      };
    });

    return {
      t: Date.now(),
      scroll: Math.round(window.scrollY),
      mosaic: probe?.dataset.mosaicProgress ?? 'N/A',
      exit: probe?.dataset.exitProgress ?? 'N/A',
      triggerTop: Math.round(triggerRect?.top ?? -1),
      triggerBot: Math.round(triggerRect?.bottom ?? -1),
      triggerH: Math.round(triggerRect?.height ?? -1),
      canvasTop: Math.round(canvasRect?.top ?? -1),
      canvasBot: Math.round(canvasRect?.bottom ?? -1),
      canvasZ: canvasStyle?.zIndex ?? 'N/A',
      canvasTransform: canvasStyle?.transform ?? 'none',
      canvasBg: canvasStyle?.backgroundColor?.substring(0, 30) ?? 'N/A',
      colContentBot: Math.round(colContentRect?.bottom ?? -1),
      colContentZ: colContentStyle?.zIndex ?? 'N/A',
      overlayH: Math.round(overlayRect?.height ?? -1),
      overlayPadBot: overlayStyle?.paddingBottom ?? 'N/A',
      sections,
      vh,
      vw,
      dpr: window.devicePixelRatio,
      docH: document.documentElement.scrollHeight,
    };
  }, []);

  // Live update
  useEffect(() => {
    const tick = () => {
      setLive(measure());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  // Record snapshot on scroll stop
  useEffect(() => {
    if (!recording) return;
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const snap = measure();
        setSnapshots(prev => [...prev, snap]);
      }, 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Take initial snapshot
    setSnapshots(prev => [...prev, measure()]);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [recording, measure]);

  const handleCopy = () => {
    const data = {
      live,
      snapshots,
      config: {
        note: 'Copy this entire block and paste to the AI',
      },
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setSnapshots([]);

  const s = live;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 10,
        lineHeight: 1.5,
        padding: 10,
        borderRadius: 8,
        maxWidth: 380,
        maxHeight: '70vh',
        overflowY: 'auto',
        pointerEvents: 'auto',
        userSelect: 'text',
      }}
    >
      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <button
          onClick={() => setRecording(r => !r)}
          style={{ fontSize: 10, padding: '2px 6px', cursor: 'pointer', background: recording ? '#f44' : '#444', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          {recording ? '⏹ Stop' : '⏺ Record'}
        </button>
        <button
          onClick={handleCopy}
          style={{ fontSize: 10, padding: '2px 6px', cursor: 'pointer', background: copied ? '#4a4' : '#444', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          {copied ? '✓ Copied!' : '📋 Copy All'}
        </button>
        <button
          onClick={handleClear}
          style={{ fontSize: 10, padding: '2px 6px', cursor: 'pointer', background: '#444', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          🗑 Clear
        </button>
        <span style={{ color: '#888' }}>{snapshots.length} snaps</span>
      </div>

      {s && (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`═══ VIEWPORT ═══
${s.vw}×${s.vh} dpr=${s.dpr} scroll=${s.scroll} docH=${s.docH}

═══ PROGRESS ═══
mosaic=${Number(s.mosaic).toFixed(3)} exit=${Number(s.exit).toFixed(3)}

═══ TRIGGER ZONE ═══
top=${s.triggerTop} bot=${s.triggerBot} h=${s.triggerH}
scrolledIn=${s.vh - s.triggerTop}

═══ CANVAS (.col-visual) ═══
top=${s.canvasTop} bot=${s.canvasBot}
z=${s.canvasZ} bg=${s.canvasBg}
transform=${s.canvasTransform}

═══ COL-CONTENT ═══
bot=${s.colContentBot} z=${s.colContentZ}

═══ OVERLAY ═══
h=${s.overlayH} pad-bot=${s.overlayPadBot}

═══ SECTIONS ═══
${s.sections.map(sec => 
  `S${sec.i}: top=${sec.top} bot=${sec.bot} z=${sec.z} ${sec.visible ? '👁️' : '  '} ${sec.classes}`
).join('\n')}`}
        </pre>
      )}
    </div>
  );
}
