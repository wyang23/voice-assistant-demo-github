import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import PlanFeatures from "./ui/plan-features";

export interface ConfirmRoamingCardProps {
  title: string;
  minutes: number;
  texts: number;
  data: string;
  price: number;
  label: string;
  duration: string;
  termsAndConditions: string;
  buttonText?: string;
  onActivate?: () => void;
}

export const ConfirmRoamingCard: React.FC<ConfirmRoamingCardProps> = ({
  title,
  termsAndConditions,
  price,
  label,
  duration,
  data,
  minutes,
  texts,
  buttonText = "Confirm Purchase",
  onActivate,
}) => (
  <Card className="opacity-75 p-6 w-full max-w-xs mx-auto bg-white/90 backdrop-blur-sm text-black border-telecom-customBorder max-h-[450px] overflow-y-auto overflow-y-scroll scrollbar scrollbar-thumb-telecom-blue scrollbar-track-telecom-blue">
    <h3 className="text-2xl font-mark-pro-heavy mb-4 text-telecom-heading">
      {title}
    </h3>
    <span className="text-xs uppercase font-mark-pro-light text-telecom-caps">
      Selected Roaming Option
    </span>
    <div className="flex flex-row items-center gap-2">
      <p className="text-2xl font-mark-pro-heavy text-telecom-heading">
        {duration}
      </p>
      <Badge variant={"value"} className="border-none h-fit">
        {label}
      </Badge>
    </div>
    <PlanFeatures data={data} minute={minutes} price={price} texts={texts} />
    <p className="text-sm font-mark-pro-heavy mb-4 text-telecom-caps">
      Terms and conditions:
    </p>
    <p className="text-sm text-gray-600 mb-4">{termsAndConditions}</p>
    {buttonText && (
      <Button onClick={onActivate} className="w-full text-black">
        {buttonText}
      </Button>
    )}
  </Card>
);

export interface PaymentSettingsCardProps {
  title: string;
  buttonText: string;
  onUpdate: () => void;
}

export const PaymentSettingsCard: React.FC<PaymentSettingsCardProps> = ({
  title,
  buttonText,
  onUpdate,
}) => (
  <Card className="p-6 w-full max-w-sm mx-auto bg-white/90 backdrop-blur-sm">
    <h3 className="text-lg font-['Mark Pro Heavy'] text-black mb-4">{title}</h3>
    <Button onClick={onUpdate} className="w-full">
      {buttonText}
    </Button>
  </Card>
);

export interface RoamingOption {
  id: number;
  price: number;
  data: string;
  texts: number;
  minutes: number;
  duration: string;
  label: string;
}

export interface RoamingOptionsCardProps {
  subtitle: string;
  options: RoamingOption[];
}

export const RoamingOptionsCard: React.FC<RoamingOptionsCardProps> = ({
  subtitle,
  options,
}) => (
  <Card className="opacity-75 p-6 w-full max-w-xs mx-auto bg-white/90 backdrop-blur-sm text-black border-telecom-customBorder rounded-3xl">
    <h3 className="text-2xl font-mark-pro-heavy mb-4 text-telecom-heading">
      {subtitle}
    </h3>
    <div className="space-y-4">
      {options.map((option, index) => {
        const displayIndex = index + 1;
        return (
          <div
            className="flex justify-between items-start"
            key={option?.id ?? displayIndex}
          >
            <div className="flex flex-col">
              <span className="text-xs uppercase font-mark-pro-light text-telecom-caps">
                {`Option ${option?.id ?? displayIndex}`}
              </span>
              <div className="flex flex-row items-center gap-2">
                <span className="text-2xl font-mark-pro-heavy text-telecom-heading">
                  {option?.duration}
                </span>
                <Badge variant={"value"} className="border-none h-fit">
                  {option?.label}
                </Badge>
              </div>
              <PlanFeatures
                data={option?.data}
                minute={option?.minutes}
                price={option?.price}
                texts={option?.texts}
              />
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

interface RoamingPlan {
  duration?: string;
  minutes: number;
  texts: number;
  data: string;
  price: number;
  label?: string;
  highSpeed?: boolean;
}

export interface OptionDetailCardProps extends RoamingPlan {
  subtitle: string;
  description: string;
  zones: string;
  network: string;
}

export const OptionDetailCard: React.FC<OptionDetailCardProps> = ({
  subtitle,
  texts,
  data,
  minutes,
  price,
  label,
  zones,
  duration,
  network,
}) => (
  <Card className="opacity-75 p-6 w-full max-w-xs mx-auto bg-white/90 backdrop-blur-sm text-black border-telecom-customBorder max-h-[450px] overflow-y-auto overflow-y-scroll scrollbar scrollbar-thumb-telecom-blue scrollbar-track-telecom-blue">
    <span className="text-xs uppercase font-mark-pro-light mb-2 text-telecom-caps">
      {subtitle}
    </span>
    <h3 className="text-2xl font-mark-pro-heavy mb-4 text-telecom-heading">
      {duration}
    </h3>
    <Badge variant={"value"} className="border-none">
      {label}
    </Badge>
    <PlanFeatures data={data} minute={minutes} price={price} texts={texts} />
    <p className="text-sm font-mark-pro-heavy mb-4 text-telecom-caps">Zones</p>
    <p className="text-sm text-gray-600 mb-4">{zones}</p>
    <p className="text-sm font-mark-pro-heavy mb-4 text-telecom-caps">
      Network & speed
    </p>
    <p className="text-sm text-gray-600 mb-4">{network}</p>
  </Card>
);

export interface ConfirmationCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  title = "Your roaming add-on has been confirmed",
  subtitle = "You're all set to jet off!",
  icon,
}) => (
  <Card className="p-6 w-full max-w-xs mx-auto bg-white/90 backdrop-blur-sm text-black border-telecom-customBorder max-h-[450px] overflow-y-auto overflow-y-scroll scrollbar scrollbar-thumb-telecom-blue scrollbar-track-telecom-blue text-center flex flex-col items-center opacity-75">
    <h3 className="text-2xl font-mark-pro-heavy mb-4 text-telecom-heading">
      {title}
    </h3>
    <p className="text-xl text-gray-600 text-telecom-caps">{subtitle}</p>
    <div className="mb-4 text-8xl">🌎</div>
  </Card>
);

// RoamingOptionDetailCard is similar to OptionDetailCard but with specific roaming features
export const RoamingOptionDetailCard = OptionDetailCard;

export const PlanOptionsCard = RoamingOptionsCard;
export const ConfirmPlanCard = ConfirmRoamingCard;