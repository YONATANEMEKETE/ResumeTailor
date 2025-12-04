import { Editor, useEditorState } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import ToolbarButton from './ToolbarButton';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
} from 'lucide-react';
import LinkEditor from './LinkEditor';

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

export default MenuBar;
