import { Badge } from "@/app/_components/ui/badge";
import { Circle } from "lucide-react";

type StatusProps = {
  status: string;
};
const getStatusProps = (status: string) => {
  console.log(status);
  switch (status) {
    case "Cancelled":
      return {
        label: "Cancelado",
        textColor: "text-red-500",
        bgColor: "bg-red-100",
      };
    case "In Process":
      return {
        label: "Em Processo",
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-100",
      };
    case "Shipped":
      return {
        label: "Enviado",
        textColor: "text-blue-500",
        bgColor: "bg-blue-100",
      };
    default:
      return {
        label: status,
        textColor: "text-green-500",
        bgColor: "bg-green-100",
      };
  }
};

export const StatusBadge: React.FC<StatusProps> = ({ status }) => {
  const { label, textColor, bgColor } = getStatusProps(status);
  return (
    <Badge
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${bgColor}`}
    >
      <Circle size={14} className={textColor} />
      <span className={textColor}>{label}</span>
    </Badge>
  );
};
