import React from "react";
import { Signal, Phone, MessageCircle, DollarSign } from "lucide-react"; // Import required icons

interface PlanFeaturesProps {
  data: string;
  texts: number;
  minute: number;
  price: number;
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({
  data,
  texts,
  minute,
  price,
}) => {
  const iconSize = 18;
  const iconColor = "text-telecom-blue";

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-4 rounded-lg">
      <div className="bg-white rounded-full p-3 flex items-center space-x-2 shadow-sm justify-center h-12">
        <Signal size={iconSize} className={iconColor} strokeWidth={2} />
        <span className="text-sm text-telecom-heading">{data} Data</span>
      </div>
      <div className="bg-white rounded-full p-3 flex items-center space-x-2 shadow-sm justify-center h-12">
        <MessageCircle size={iconSize} className={iconColor} strokeWidth={2} />
        <span className="text-sm text-telecom-heading">{texts} Texts</span>
      </div>
      <div className="bg-white rounded-full p-3 flex items-center space-x-2 shadow-sm justify-center h-12">
        <Phone size={iconSize} className={iconColor} strokeWidth={2} />
        <span className="text-sm text-telecom-heading">{minute} min</span>
      </div>
      <div className="bg-white rounded-full p-3 flex items-center space-x-2 shadow-sm justify-center h-12">
        <DollarSign size={iconSize} className={iconColor} strokeWidth={2} />
        <span className="text-sm text-telecom-heading font-medium">
          {price}
        </span>
      </div>
    </div>
  );
};

export default PlanFeatures;
