import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import loader from '@monaco-editor/loader';
import { editor } from 'monaco-editor';
import { useTheme } from '@/context/themeProvider';

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
  // className?: string;
  // toolbarClassName?: string;
  hideFooter?: boolean;
  options?: editor.IStandaloneEditorConstructionOptions;
  onAnimationEnd?: () => void;
}

function JsonEditor({
  value,
  onChange,
  readOnly,
  // className,
  // toolbarClassName,
  hideFooter = false,
  options,
  onAnimationEnd,
}: JsonEditorProps) {
  // internal value for readOnly mode, for formatting buttons
  const [internalValue, setValue] = useState(value);
  const [position, setPosition] = useState<Position>({ line: 1, column: 1 });
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();
  const { theme } = useTheme();

  useEffect(() => {
    if (!editor) return;

    editor.onDidChangeCursorPosition(e => {
      const line = e.position.lineNumber;
      const { column } = e.position;
      setPosition({ line, column });
    });
  }, [editor]);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border border-foundations-subtle"
      onAnimationEnd={onAnimationEnd}
    >
      <Editor
        language="json"
        value={readOnly ? internalValue : value}
        width="100%"
        onMount={editor => setEditor(editor)}
        theme={theme === 'dark' ? 'vs-dark' : undefined}
        className="
        min-h-[266px] [&_.lines-content]:border-l
        [&_.lines-content]:border-border
        [&_.monaco-editor]:[--vscode-editor-background:theme(colors.background)]
        [&_.monaco-editor]:[--vscode-editorGutter-background:theme(colors.background)]
        [&_.monaco-editor]:[--vscode-editorLineNumber-activeForeground:theme(colors.foreground)]
        [&_.monaco-editor]:[--vscode-editorLineNumber-foreground:theme(textColor.subtler)]"
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
          padding: {
            top: 8,
            bottom: 8,
          },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          hideCursorInOverviewRuler: true,
          guides: { indentation: false },
          wrappingIndent: 'indent',
          lineNumbersMinChars: 3,
          suggest: {
            showProperties: false,
          },
          ...options,
        }}
      />
      {!hideFooter && (
        <div className="text-foundations flex items-center space-x-3 border-t border-t-foundations-subtle bg-foundations-subtlest px-3 py-2 text-xs ">
          <span>Ln: {position.line}</span>
          <span>Col: {position.column}</span>
        </div>
      )}
    </div>
  );
}

export default JsonEditor;
