import { Toggle } from '@/components/ui/toggle';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import {
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  List,
  ListOrdered,
  PilcrowIcon,
  StrikethroughIcon,
  Underline
} from 'lucide-react';

export const TextToolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false
      };
    }
  });

  return (
    <div className="control-group">
      <div className="flex gap-2 flex-wrap">
        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          pressed={editorState.isBold}
          disabled={!editorState.canBold}
        >
          <BoldIcon />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          pressed={editorState.isItalic}
          disabled={!editorState.canItalic}
        >
          <ItalicIcon />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          pressed={editorState.isUnderline}
          disabled={!editorState.canUnderline}
        >
          <Underline />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          pressed={editorState.isStrike}
          disabled={!editorState.canStrike}
        >
          <StrikethroughIcon />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().setParagraph().run()}
          pressed={editorState.isParagraph}
        >
          <PilcrowIcon />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          pressed={editorState.isHeading1}
        >
          <Heading1 />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          pressed={editorState.isHeading2}
        >
          <Heading2 />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          pressed={editorState.isHeading3}
        >
          <Heading3 />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          pressed={editorState.isBulletList}
        >
          <List />
        </Toggle>

        <Toggle
          variant={'outline'}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          pressed={editorState.isOrderedList}
        >
          <ListOrdered />
        </Toggle>
      </div>
    </div>
  );
};
