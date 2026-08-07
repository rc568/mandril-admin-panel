import { useCurrentEditor } from '@tiptap/react';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  id: string;
  className?: string;
}

export const TextEditorLabel = ({ id, children, className }: Props) => {
  const { editor } = useCurrentEditor();

  return (
    <span id={id} className={className} onClick={() => editor?.commands.focus()}>
      {children}
    </span>
  );
};
