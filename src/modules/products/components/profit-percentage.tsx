import { formatPercentage } from '@/lib/currency';

export const ProfitPercentage = ({ num }: { num: number }) => {
  if (num === 0) return <span className="text-muted-foreground"></span>;

  if (num < 0) return <span className="text-destructive">{`↓ ${formatPercentage(num)}`}</span>;

  return <span className="text-success">{`↑ ${formatPercentage(num)}`}</span>;
};
