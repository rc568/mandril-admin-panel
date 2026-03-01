import { EditorContent, useCurrentEditor } from '@tiptap/react';

export const TextEditor = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return <EditorContent editor={editor} className="max-h-[512px] overflow-y-scroll"></EditorContent>;
};
