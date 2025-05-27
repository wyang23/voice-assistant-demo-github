import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Check, HelpCircle, X } from "lucide-react";

export interface DeviceCheckCardProps {
  cardType: "deviceCompatible" | "deviceIncompatible" | "uncertain";
  deviceInfo?: string;
  onCheckComplete: (result: {
    status: "compatible" | "incompatible" | "uncertain";
    deviceInfo?: string;
  }) => void;
}

export const DeviceCheckCard: React.FC<DeviceCheckCardProps> = ({
  cardType,
  deviceInfo,
  onCheckComplete,
}) => {
  const getStatusContent = () => {
    switch (cardType) {
      case "deviceCompatible":
        return {
          title: "You're All Set!",
          description: "Your device is compatible with eSIM technology.",
          icon: <Check className="w-12 h-12 text-[#8AB661]" />,
          buttonText: "Got It!",
          buttonStyle: "bg-[#8AB661] hover:bg-[#7AA551] text-white",
        };
      case "deviceIncompatible":
        return {
          title: "Device Not Compatible",
          description:
            "Unfortunately, your device does not support eSIM technology.",
          icon: <X className="w-12 h-12 text-red-500" />,
          buttonText: "Learn More",
          buttonStyle: "bg-red-500 hover:bg-red-600 text-white",
        };
      case "uncertain":
        return {
          title: "Let's Check Your Device",
          description:
            "We need to verify if your device supports eSIM technology.",
          icon: <HelpCircle className="w-12 h-12 text-[#8AB661]" />,
          buttonText: "Check Compatibility",
          buttonStyle: "bg-[#8AB661] hover:bg-[#7AA551] text-white",
        };
    }
  };

  const content = getStatusContent();

  return (
    <Card className="mx-auto bg-white rounded-2xl shadow-md border-0">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-6 p-4 rounded-full bg-[#8AB661] bg-opacity-10">
          {content?.icon}
        </div>
        <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
        <p className="text-gray-600 mb-8 text-base">{content.description}</p>
        {deviceInfo && (
          <p className="text-gray-600 mb-4">Device Info: {deviceInfo}</p>
        )}
        <Button
          onClick={() =>
            onCheckComplete({
              status:
                cardType === "deviceCompatible"
                  ? "compatible"
                  : cardType === "deviceIncompatible"
                  ? "incompatible"
                  : "uncertain",
              deviceInfo,
            })
          }
          className={`w-full py-3 rounded-lg font-medium ${content.buttonStyle}`}
        >
          {content.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
