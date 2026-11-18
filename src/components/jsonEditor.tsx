import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import loader from '@monaco-editor/loader';
import type { editor } from 'monaco-editor';
import clsx from 'clsx';

// Self-hosted Monaco (public/monaco) — only the JSON language is bundled.
loader.config({
  paths: { vs: '/monaco/vs' },
});

type Position = {
  line: number;
  column: number;
};

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  hideFooter?: boolean;
  options?: editor.IStandaloneEditorConstructionOptions;
}

export default function JsonEditor({
  value,
  onChange,
  readOnly,
  className,
  hideFooter = false,
  options,
}: JsonEditorProps) {
  const [position, setPosition] = useState<Position>({ line: 1, column: 1 });
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (!editorInstance) return undefined;

    const disposable = editorInstance.onDidChangeCursorPosition(e => {
      setPosition({ line: e.position.lineNumber, column: e.position.column });
    });
    return () => disposable.dispose();
  }, [editorInstance]);

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gray-300">
      <Editor
        language="json"
        value={value}
        width="100%"
        onMount={setEditorInstance}
        className={clsx(
          'min-h-[220px] [&_.lines-content]:border-l [&_.lines-content]:border-gray-200',
          className,
        )}
        onChange={v => onChange?.(v || '')}
        options={{
          readOnly,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            alwaysConsumeMouseWheel: false,
          },
          autoClosingQuotes: 'always',
          minimap: { enabled: false },
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          guides: { indentation: false },
          wrappingIndent: 'indent',
          lineNumbersMinChars: 3,
          fixedOverflowWidgets: true,
          suggest: { showProperties: false },
          ...options,
        }}
      />
      {!hideFooter && (
        <div className="flex items-center space-x-3 border-t border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          <span>Ln: {position.line}</span>
          <span>Col: {position.column}</span>
        </div>
      )}
    </div>
  );
}
