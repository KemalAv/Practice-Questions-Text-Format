import React, { useEffect, useRef, memo } from 'react';

// Define MathJax on the window object for TypeScript
declare global {
  interface Window {
    MathJax?: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: {
        promise: Promise<void>;
      };
    };
  }
}

interface LatexRendererProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = memo(({ children, ...props }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Function to typeset the element
    const typesetMath = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([element]).catch((err) => {
          console.error("MathJax typeset error:", err);
        });
      }
    };

    // Check if MathJax is ready. If so, typeset. If not, wait for it.
    if (window.MathJax?.startup?.promise) {
      window.MathJax.startup.promise.then(() => {
        typesetMath();
      });
    } else {
      // A fallback for cases where the script might be loaded but the promise isn't immediately available,
      // or if our component renders before the main script tag is processed.
      typesetMath();
    }
  }, [children]); // Re-run the effect whenever the text content changes

  // Render children directly. The useEffect hook will then trigger MathJax to process it.
  // This helps avoid content flashing and is good for progressive enhancement.
  return <span ref={ref} {...props}>{children}</span>;
});