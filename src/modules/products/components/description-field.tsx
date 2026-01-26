import { TextEditorProvider } from '@/context/text-editor-provider';
import { Info } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import { TextEditor } from '../../../components/common/text-editor/text-editor';
import { TextToolbar } from '../../../components/common/text-editor/text-toolbar';
import { Label } from '../../../components/ui/label';

export const DescriptionField = ({ defaultContent }: { defaultContent?: string }) => {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({
    name: 'description',
    control,
    defaultValue: defaultContent ?? ''
  });

  return (
    <TextEditorProvider content={value} className="prose prose-sm border min-h-28 max-w-full p-2" onChange={onChange}>
      <Label id="description" className="text-sm font-medium text-foreground flex items-center gap-2">
        Descripción (*)
        <Info className="h-3 w-3 text-muted-foreground" />
      </Label>

      <div aria-labelledby="description" className="space-y-2">
        <TextToolbar />
        <TextEditor />
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </TextEditorProvider>
  );
};
