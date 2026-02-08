import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  footer?: ReactNode;
}

export function StatCard({ title, value, icon, footer }: Props) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            {footer && <div className="mt-2">{footer}</div>}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
