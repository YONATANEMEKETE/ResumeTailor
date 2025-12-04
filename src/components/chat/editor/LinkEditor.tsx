import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, ExternalLink, Unlink } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

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

export default LinkEditor;
