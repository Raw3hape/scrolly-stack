/**
 * Spinner — Foundation Projects
 *
 * Reusable loading spinner. Replaces duplicated spinners in Scene.tsx and ScrollyLoader.tsx.
 */

import './Spinner.css';

interface SpinnerProps {
  /** Size in px (default: 48) */
  size?: number;
  /** Optional status text below spinner */
  label?: string;
}

export default function Spinner({ size = 48, label }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="spinner__label">{label}</p>}
    </div>
  );
}
