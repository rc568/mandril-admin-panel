import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  icon?: React.ReactNode;
}

export const ProductStatCard = ({ title, icon, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <header className="flex items-center justify-between">
          <p className="text-base text-muted-foreground">{title}</p>
          {icon}
        </header>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
