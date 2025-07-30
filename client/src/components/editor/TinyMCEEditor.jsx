// TinyMCEEditor.jsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '@mui/material/styles';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = forwardRef(function TinyMCEEditor({ content, onChange, height = 600 }, ref) {
  const editorRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Expose setContent and getContent methods to parent
  useImperativeHandle(ref, () => ({
    setContent: (html) => {
      editorRef.current?.setContent(html);
    },
    getContent: () => {
      return editorRef.current?.getContent();
    },
  }));

  return (
    <Editor
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      key={theme.palette.mode}
      apiKey="022lwodjci7082m62n4p6mm5rjhjokie7osayymmp7if5p6v"
      value={content}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        skin: isDark ? 'oxide-dark' : 'oxide',
        content_css: isDark ? 'dark' : 'default',
        plugins: ['lists', 'link', 'code'],
        toolbar:
          'undo redo | formatselect | bold italic underline | bullist numlist | link | code',
        content_style: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            padding: 1rem;
            color: ${isDark ? '#f5f5f5' : '#222'};
            background-color: ${isDark ? '#1e1e1e' : '#fff'};
          }
        `,
      }}
    />
  );
});

export default TinyMCEEditor;
