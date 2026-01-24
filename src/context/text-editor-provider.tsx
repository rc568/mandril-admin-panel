import { Markdown } from '@tiptap/markdown';
import { EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useMemo, type PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  content?: string;
}

export const TextEditorProvider = ({ children, content, ...editorOptions }: Props) => {
  const editor = useEditor({
    ...editorOptions,
    content: content,
    contentType: 'markdown',
    extensions: [StarterKit, Markdown],
    editorProps: { attributes: { class: 'px-4 py-2 prose prose-sm outline max-w-full' } }
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return <EditorContext.Provider value={providerValue}>{children}</EditorContext.Provider>;
};
