import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBgColor: string;
}

export default function MetricCard({
  label,
  value,
  icon,
  iconBgColor,
}: MetricCardProps) {
  const ValidIcon = icon || AlertCircle;

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>{" "}
        {/* Adjusted text color */}
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: iconBgColor }}
        >
          <ValidIcon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>{" "}
        {/* Adjusted text color */}
      </CardContent>
    </Card>
  );
}
