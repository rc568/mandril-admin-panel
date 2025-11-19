import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  title: string;
  subtitle?: string;
}

export const Title = ({ title, subtitle }: Props) => {
  return (
    <section className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <h2 className="text-muted-foreground">{subtitle}</h2>}
      </div>
      <Button size="lg">
        <Plus className="w-4 h-4" />
        Crear producto
      </Button>
    </section>
  );
};
