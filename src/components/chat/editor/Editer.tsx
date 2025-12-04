'use client';

import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import MenuBar from './MenuBar';

interface EditerProps {
  content: string;
  onChange: (content: string) => void;
}

const Editer = ({ content, onChange }: EditerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            'text-primary font-medium underline cursor-pointer hover:text-primary/80',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start editing your resume...',
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const htmlContent: string = editor.getHTML();
      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[600px] px-16 py-12',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border shadow-sm overflow-hidden">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-secondary/20">
        <div className="max-w-[850px] mx-auto bg-background shadow-lg min-h-[1056px]">
          <EditorContent
            editor={editor}
            className="w-full h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[600px] p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Editer;
