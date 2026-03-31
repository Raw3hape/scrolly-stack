import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Foundation Projects — We Take Roofing Companies Public';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  // Read the icon SVG from the app directory and encode as base64 data URI
  // Use the OG-specific icon with inverted colors for dark background
  const iconPath = join(process.cwd(), 'src', 'app', 'og-icon.svg');
  const iconBuffer = await readFile(iconPath);
  const iconBase64 = iconBuffer.toString('base64');
  const iconDataUri = `data:image/svg+xml;base64,${iconBase64}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#103740',
      }}
    >
      {/* Logo icon */}
      <img src={iconDataUri} width={160} height={160} alt="" style={{ marginBottom: 36 }} />

      {/* Company name */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#F2EDE4',
            letterSpacing: '0.08em',
          }}
        >
          FOUNDATION PROJECTS
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#D79344',
            letterSpacing: '0.04em',
          }}
        >
          We Take Roofing Companies Public
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          display: 'flex',
        }}
      >
        <div style={{ flex: 1, backgroundColor: '#D79344' }} />
        <div style={{ flex: 1, backgroundColor: '#3A8C8C' }} />
        <div style={{ flex: 1, backgroundColor: '#D0E8E8' }} />
      </div>
    </div>,
    { ...size },
  );
}
