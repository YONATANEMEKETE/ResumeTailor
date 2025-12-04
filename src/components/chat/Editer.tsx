'use client';

import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link2,
  Strikethrough,
  ExternalLink,
  Unlink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface EditerProps {
  content: string;
  onChange: (content: string) => void;
}

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  tooltip,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip?: string;
}) => (
  // todo add tooltip here for the buttons
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'h-8 w-8 p-0 hover:bg-secondary/80 transition-colors',
          isActive && 'bg-secondary text-primary'
        )}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

const LinkEditor = ({ editor }: { editor: Editor }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to, '');
  const currentLink = editor.getAttributes('link').href;

  useEffect(() => {
    if (isOpen) {
      setUrl(currentLink || '');
      setText(selectedText || '');
    }
  }, [isOpen, currentLink, selectedText]);

  // Add keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSetLink = useCallback(() => {
    if (!url) return;

    // If there's custom text and it differs from selection, update the text
    if (text && text !== selectedText) {
      editor
        .chain()
        .focus()
        .deleteSelection()
        .insertContent({
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
                target: '_blank',
              },
            },
          ],
          text: text,
        })
        .run();
    } else {
      // Just add/update the link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank' })
        .run();
    }

    setIsOpen(false);
    setUrl('');
    setText('');
  }, [editor, url, text, selectedText]);

  const handleRemoveLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
    setUrl('');
    setText('');
  }, [editor]);

  const isActive = editor.isActive('link');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <ToolbarButton
            onClick={() => setIsOpen(!isOpen)}
            isActive={isActive}
            tooltip="Add link (Ctrl+K)"
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Text (optional)</label>
            <Input
              type="text"
              placeholder="Link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSetLink}
              disabled={!url}
              className="flex-1"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              {isActive ? 'Update' : 'Add'} Link
            </Button>
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveLink}
                className="flex-1"
              >
                <Unlink className="h-3 w-3 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
      <div className="flex items-center justify-center gap-1 px-4 py-1 flex-wrap">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
            tooltip="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
            tooltip="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6 mx-1"
        />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editorState.isHeading1}
            tooltip="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editorState.isHeading2}
            tooltip="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editorState.isHeading3}
            tooltip="Heading 3"
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActive={editorState.isHeading4}
            tooltip="Heading 4"
          >
            H4
          </ToolbarButton>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6 mx-1"
        />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          {/*  */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            isActive={editorState.isBold}
            tooltip="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            isActive={editorState.isItalic}
            tooltip="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            isActive={editorState.isStrike}
            tooltip="Strike"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6 mx-1"
        />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editorState.isBulletList}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editorState.isOrderedList}
            tooltip="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6 mx-1"
        />
        {/* Link */}
        <LinkEditor editor={editor} />
      </div>
    </div>
  );
};

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
