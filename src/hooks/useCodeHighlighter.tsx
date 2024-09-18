import { getHighlighterCore } from 'shiki/core';

// `shiki/wasm` contains the wasm binary inlined as base64 string.
import getWasm from 'shiki/wasm';

// directly import the theme and language modules, only the ones you imported will be bundled.
import nightOwl from 'shiki/themes/night-owl.mjs';

const highlighter = getHighlighterCore({
  themes: [nightOwl],
  langs: [
    import('shiki/langs/javascript.mjs'),
    import('shiki/langs/shell.mjs'),
  ],
  loadWasm: getWasm,
});

export default function useCodeHighlighter() {
  return highlighter;
}
