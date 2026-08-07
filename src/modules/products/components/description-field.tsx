import { FormErrorMessage } from '@/components/common/form-error-message';
import { TextEditorLabel } from '@/components/common/text-editor/text-editor-label';
import { TextEditorProvider } from '@/context/text-editor-provider';
import { useController, useFormContext } from 'react-hook-form';
import { TextEditor } from '../../../components/common/text-editor/text-editor';
import { TextToolbar } from '../../../components/common/text-editor/text-toolbar';

export const DescriptionField = ({ defaultContent }: { defaultContent?: string }) => {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name: 'description',
    control
  });

  return (
    <TextEditorProvider
      content={value}
      className="prose prose-sm border max-w-full h-52 overflow-y-auto p-2"
      onChange={onChange}
      placeholder={defaultContent}
    >
      <TextEditorLabel id="description" className="text-sm font-medium text-foreground flex gap-2 items-center">
        Descripción (opcional)
      </TextEditorLabel>

      <div aria-labelledby="description" className="space-y-2 w-full">
        <TextToolbar />
        <TextEditor />
      </div>

      {error?.message && <FormErrorMessage text={error.message} />}
    </TextEditorProvider>
  );
};
