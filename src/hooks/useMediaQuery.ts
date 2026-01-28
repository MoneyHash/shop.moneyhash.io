import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mq = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mq.addEventListener('change', listener);

    return () => {
      mq.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
