import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { formatShortDate } from '@/lib/date-utils';

interface Props {
  createdBy: string;
  createdAt: Date | string;
}

export const ProductEditStatsCard = ({ createdAt, createdBy }: Props) => {
  return (
    <Card>
      <CardContent>
        <article className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 text-sm pb-8 border-b">
            <h3 className="font-semibold text-base">Estadísticas:</h3>
            <div className="flex flex-col items-end w-full">
              <div>
                <span className="font-semibold text-xl">25 und</span>
                <span className="text-muted-foreground text-sm italic ml-2">Vendidas este último mes</span>
              </div>
              <span className="italic text-success">15.45% ↑ (comparativa con el mes pasado)</span>
            </div>

            <div className="flex flex-col items-end w-full">
              <div>
                <span className="font-semibold text-xl">{formatCurrency(1500)}</span>
                <span className="text-muted-foreground text-sm italic ml-2">Ganancia total este último mes</span>
              </div>
              <span className="italic text-destructive">13.45% ↓ (comparativa con el mes pasado)</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <h3 className="font-semibold text-base">Detalles del registro:</h3>
            <div className="flex justify-between w-full">
              <span className="italic">Creado por:</span>
              <span>{createdBy}</span>
            </div>

            <div className="flex justify-between w-full">
              <span className="italic">Fecha de creación:</span>
              <span>{formatShortDate(createdAt)}</span>
            </div>
          </div>
        </article>
      </CardContent>
    </Card>
  );
};
