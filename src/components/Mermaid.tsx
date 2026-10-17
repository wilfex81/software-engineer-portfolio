import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [id] = useState(`mermaid-${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    if (!ref.current || !chart) return;
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'neutral',
      securityLevel: 'strict',
      fontFamily: 'Inter, sans-serif',
    });
    mermaid
      .render(id, chart)
      .then((result) => {
        if (ref.current) ref.current.innerHTML = result.svg;
      })
      .catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.textContent = 'Diagram failed to load.';
        }
      });
  }, [chart, id]);

  return (
    <div className="flex justify-center overflow-x-auto bg-card/50 p-4 rounded-xl border border-border/40">
      <div ref={ref} className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto" />
    </div>
  );
};

export default Mermaid;
