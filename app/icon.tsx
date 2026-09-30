import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF70A6',
          border: '3px solid #000000',
          borderRadius: '7px',
          fontWeight: 900,
          fontSize: '18px',
          color: '#000000',
        }}
      >
        ∑
      </div>
    ),
    { ...size }
  );
}
