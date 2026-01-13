/**
 * HoverTooltip Component
 * 
 * Frosted glass popup that follows cursor and displays layer information.
 * Dynamically renders content from data.js layer configuration.
 */

import { useRef, useMemo } from 'react';
import { animation } from '../config';
import './HoverTooltip.css';

export default function HoverTooltip({ hoveredBlock, mousePosition }) {
  const tooltipRef = useRef(null);
  
  // Get tooltip offset from config
  const offsetX = animation.hover?.tooltip?.offsetX || 16;
  const offsetY = animation.hover?.tooltip?.offsetY || 16;
  
  // Calculate position with viewport bounds check using useMemo
  const position = useMemo(() => {
    if (!hoveredBlock || !mousePosition) {
      return { x: 0, y: 0 };
    }
    
    const tooltipWidth = 280; // max-width from CSS
    const tooltipHeight = 150; // approximate height
    const padding = 16;
    
    let x = mousePosition.x + offsetX;
    let y = mousePosition.y + offsetY;
    
    // Keep within viewport bounds
    if (x + tooltipWidth + padding > window.innerWidth) {
      x = mousePosition.x - tooltipWidth - offsetX;
    }
    if (y + tooltipHeight + padding > window.innerHeight) {
      y = mousePosition.y - tooltipHeight - offsetY;
    }
    
    // Clamp to minimum padding from edges
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
    y = Math.max(padding, y);
    
    return { x, y };
  }, [hoveredBlock, mousePosition, offsetX, offsetY]);
  
  // Visibility based on whether block is hovered
  const isVisible = Boolean(hoveredBlock && mousePosition);
  
  // Don't render if no hovered block
  if (!hoveredBlock) {
    return null;
  }
  
  const { tooltipTitle, tooltipSubhead, bullets, color } = hoveredBlock;
  
  return (
    <div
      ref={tooltipRef}
      className={`hover-tooltip ${isVisible ? 'hover-tooltip--visible' : 'hover-tooltip--hiding'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <h4 className="hover-tooltip__title">
        <span 
          className="hover-tooltip__accent-bar" 
          style={{ backgroundColor: color }}
        />
        {tooltipTitle || 'Layer'}
      </h4>
      
      {tooltipSubhead && (
        <p 
          className="hover-tooltip__subhead"
          style={{ color }}
        >
          {tooltipSubhead}
        </p>
      )}
      
      {bullets && bullets.length > 0 && (
        <ul className="hover-tooltip__bullets">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
