import { useEffect, useRef, useState } from 'react';
import useCodeHighlighter from '../hooks/useCodeHighlighter';

export default function CodeBlock({
  code,
  lang = 'javascript',
}: {
  code: string;
  lang?: 'javascript' | 'shell';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const highlighterPromise = useCodeHighlighter();
  useEffect(() => {
    highlighterPromise?.then(highlighter => {
      const html = highlighter.codeToHtml(code.trim(), {
        lang,
        theme: 'night-owl',
      });
      ref.current!.innerHTML = html;
      setIsReady(true);
    });
  }, [highlighterPromise, code, lang]);
  return (
    <div
      ref={ref}
      className={
        isReady
          ? '[&_pre]:p-3 [&_pre]:rounded-md'
          : 'whitespace-pre-wrap text-sm not-prose rounded-md p-3 blur-md'
      }
    >
      {code}
    </div>
  );
}
