"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MessageSquare, Phone, Wifi, MapPin } from "lucide-react";

interface OptionDetailCardProps {
  duration: string;
  subtitle: string;
  minutes: string | number;
  texts: string | number;
  data: string;
  price: number;
  label: string;
  description: string;
  zones: string;
  network: string;
  className?: string;
}

export default function OptionDetailCard({
  duration,
  subtitle,
  minutes,
  texts,
  data,
  price,
  label,
  description,
  zones,
  network,
  className = "",
}: OptionDetailCardProps) {
  return (
    <Card
      className={`opacity-75 p-6 w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm text-black border-telecom-customBorder ${className}`}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-mark-pro-light text-telecom-caps block mb-2">
            {subtitle}
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-mark-pro-heavy text-telecom-heading">
              {duration}
            </h2>
            <Badge className="font-mark-pro bg-[#FFF2DC] text-telecom-tertiary border-0">
              {label}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-mark-pro-heavy text-telecom-heading">
            Includes
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-telecom-blue" />
              <span className="text-sm">{data}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-telecom-blue" />
              <span className="text-sm">{texts} texts</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-telecom-blue" />
              <span className="text-sm">{minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-telecom-blue font-mark-pro-heavy">$</span>
              <span className="text-sm">{price}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-mark-pro-heavy text-telecom-heading">
            Coverage
          </h3>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-telecom-blue mt-0.5" />
            <p className="text-sm text-telecom-caps">{zones}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-mark-pro-heavy text-telecom-heading">
            Network & Speed
          </h3>
          <div className="flex items-start gap-2">
            <Wifi className="h-5 w-5 text-telecom-blue mt-0.5" />
            <p className="text-sm text-telecom-caps">{network}</p>
          </div>
        </div>

        {description && (
          <p className="text-sm text-telecom-caps">{description}</p>
        )}
      </div>
    </Card>
  );
}
