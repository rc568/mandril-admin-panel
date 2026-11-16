import { Button } from '../../../components/ui/button';

interface PageMessageProps {
  title: string;
  description?: string;
  onBack?: () => void;
  onRetry?: () => void;
}

export const PageMessage = ({ title, description, onBack, onRetry }: PageMessageProps) => (
  <div className="mx-auto max-w-7xl space-y-4 py-6">
    <h1 className="text-lg">{title}</h1>
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
    <div className="flex gap-2">
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
      {onBack && (
        <Button type="button" variant="outline" onClick={onBack}>
          Volver a ventas
        </Button>
      )}
    </div>
  </div>
);
