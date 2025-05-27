import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

export interface TrialConfirmationCardProps {
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  trialDetails?: {
    duration: string;
    data: string;
    calls: string;
    texts: string;
    cost: string;
  };
  nextSteps?: string;
  icon?: string;
}

export const TrialConfirmationCard: React.FC<TrialConfirmationCardProps> = ({
  onConfirm,
  title = "You're connected!",
  subtitle = "Your 3-day backup trial is now active",
  description = "You're now connected to our network as backup coverage",
  trialDetails,
  nextSteps,
  icon = "check-circle",
}) => {
  return (
    <Card className="mx-auto bg-white rounded-2xl shadow-md border-0">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-6 p-4 rounded-full bg-[#8AB661] bg-opacity-10">
          <CheckCircle className="w-12 h-12 text-[#8AB661]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <h3 className="text-lg text-gray-700 mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {trialDetails && (
          <div className="w-full mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-400">
                  {trialDetails.duration}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Cost</p>
                <p className="font-medium text-gray-400">{trialDetails.cost}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium text-gray-400">{trialDetails.data}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Calls & Texts</p>
                <p className="font-medium text-gray-400">
                  {trialDetails.calls}
                </p>
              </div>
            </div>
          </div>
        )}

        {nextSteps && <p className="text-sm text-gray-600 mb-6">{nextSteps}</p>}

        <Button
          onClick={onConfirm}
          className="w-full bg-[#8AB661] hover:bg-[#7AA551] text-white py-3 rounded-lg font-medium"
        >
          Got It!
        </Button>
      </CardContent>
    </Card>
  );
};
