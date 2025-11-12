import React from "react";

export default function Logo({ size = 20, color = "white", className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none"
      className={className}
    >
      <path 
        d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M32 20C32 26.627 26.627 32 20 32C13.373 32 8 26.627 8 20C8 13.373 13.373 8 20 8" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );
}