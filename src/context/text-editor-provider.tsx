import Underline from '@tiptap/extension-underline';
import { Markdown } from '@tiptap/markdown';
import { EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useMemo, type PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  content?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export const TextEditorProvider = ({ children, className, content, onChange, ...editorOptions }: Props) => {
  const editor = useEditor({
    ...editorOptions,
    content: content,
    contentType: 'markdown',
    extensions: [StarterKit, Markdown, Underline],
    editorProps: { attributes: { class: className ?? '' } },
    onUpdate({ editor }) {
      const markdown = editor.getMarkdown();
      onChange?.(markdown);
    }
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return <EditorContext.Provider value={providerValue}>{children}</EditorContext.Provider>;
};
