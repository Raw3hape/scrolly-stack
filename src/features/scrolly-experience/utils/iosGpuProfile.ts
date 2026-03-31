/**
 * iosGpuProfile — iOS GPU capability detection & config overrides.
 *
 * PURPOSE: iOS Safari (and ALL iOS browsers — they all use WebKit) has
 * specific WebGL limitations that cause silent rendering failures:
 * - MSAA render targets crash EffectComposer
 * - VSMShadowMap float textures fail silently
 * - AgXToneMapping LUT shader exceeds compilation limits
 * - MeshPhysicalMaterial with iridescence+clearcoat+sheen hits shader ceiling
 *
 * ISOLATION: Every consumer gates on `isIOS()` — desktop code paths are
 * byte-for-byte identical to pre-fix behavior.
 *
 * DETECTION: Uses navigator.userAgent + maxTouchPoints, NOT feature detection.
 * Rationale: WebGL feature detection (e.g. checking OES_texture_float) doesn't
 * reliably predict silent crashes — iOS reports extensions as supported then
 * fails at draw time. UA sniffing is the pragmatic choice here.
 */

/** Cache the result — runs once per page load */
let _isIOS: boolean | null = null;

/**
 * Returns true on any iOS device (iPhone, iPad, iPod).
 *
 * Handles edge cases:
 * - iPad with "Request Desktop Website" → reports navigator.platform = 'MacIntel'
 *   but has maxTouchPoints > 1 (real Macs have 0)
 * - Chrome / Firefox / Edge on iOS → all WebKit under the hood, same GPU limits
 * - Does NOT match desktop Safari, macOS, or Android
 */
export function isIOS(): boolean {
  if (_isIOS !== null) return _isIOS;

  if (typeof navigator === 'undefined') {
    _isIOS = false;
    return false;
  }

  const ua = navigator.userAgent;

  // iPhone / iPod — straightforward
  const isIPhoneOrIPod = /iPhone|iPod/.test(ua);

  // iPad — two detection paths:
  // 1. Old iPads: "iPad" in UA string
  // 2. iPadOS 13+: reports as Mac, but has touch (real Macs don't)
  const isIPad =
    /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  _isIOS = isIPhoneOrIPod || isIPad;
  return _isIOS;
}

/**
 * GPU config overrides for iOS. Returns null on non-iOS (desktop unchanged).
 *
 * All values are chosen to avoid silent WebGL crashes while maintaining
 * the best possible visual quality on iOS hardware.
 */
export interface IOSGpuOverrides {
  /** EffectComposer: 0 = no MSAA on effects pass (avoids render target crash) */
  multisampling: number;
  /** PCFSoftShadowMap avoids float texture requirement of VSM */
  shadowMapType: 'PCFSoftShadowMap';
  /** ACESFilmic is well-tested on iOS, AgX can exceed shader limits */
  toneMapping: 'ACESFilmicToneMapping';
  /** Explicit high-perf request — iOS defaults to low-power GPU otherwise */
  powerPreference: 'high-performance';
  /** Disable expensive material features that add extra shader passes */
  materialOverrides: {
    iridescence: number;
    clearcoat: number;
    sheen: number;
  };
}

export function getIOSGpuOverrides(): IOSGpuOverrides | null {
  if (!isIOS()) return null;

  return {
    multisampling: 0,
    shadowMapType: 'PCFSoftShadowMap',
    toneMapping: 'ACESFilmicToneMapping',
    powerPreference: 'high-performance',
    materialOverrides: {
      iridescence: 0,
      clearcoat: 0,
      sheen: 0,
    },
  };
}
