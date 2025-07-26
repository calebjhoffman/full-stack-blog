// TinyMCEEditor.jsx
import { useTheme } from '@mui/material/styles';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCEEditor({ content, onChange, height = 600 }) {
  const editorRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Editor
      key={theme.palette.mode} // rerenders on theme change
      apiKey="022lwodjci7082m62n4p6mm5rjhjokie7osayymmp7if5p6v"
      value={content} // ✅ controlled mode
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
}
