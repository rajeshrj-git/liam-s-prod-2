import { ProductCondition } from "@/lib/types";

export default function ConditionBadge({ condition }: { condition: ProductCondition }) {
  const getBadgeStyle = () => {
    switch (condition) {
      case "premium":
        return "bg-[#E6A817]/20 text-[#E6A817] border border-[#E6A817]/30";
      case "organic":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "natural":
        return "bg-amber-500/20 text-amber-600 border border-amber-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${getBadgeStyle()}`}>
      {condition}
    </span>
  );
}
