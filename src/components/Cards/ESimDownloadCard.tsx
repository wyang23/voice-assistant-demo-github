import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Smartphone } from "lucide-react";

export interface ESimDownloadCardProps {
  onDownloadComplete: (success: boolean) => void;
  qrCodeUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  instructions?: string[];
  supportText?: string;
}

export const ESimDownloadCard: React.FC<ESimDownloadCardProps> = ({
  onDownloadComplete,
  qrCodeUrl,
  title = "Download your eSIM",
  subtitle = "Your backup connection is ready",
  description = "Tap below to download and install your 3-day trial eSIM",
  buttonText = "Download eSIM",
  instructions = [
    "Tap 'Download eSIM' below",
    "Follow the setup prompts on your device",
    "Your backup connection will be active immediately",
    "Keep your original SIM active too",
  ],
  supportText = "Need help? We're here if you get stuck",
}) => {
  return (
    <Card className="mx-auto bg-white rounded-2xl shadow-md border-0">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-6 p-4 rounded-full bg-[#8AB661] bg-opacity-10">
          <Smartphone className="w-12 h-12 text-[#8AB661]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <h3 className="text-lg text-gray-700 mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="w-full mb-8">
          <div className="space-y-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8AB661] bg-opacity-10 flex items-center justify-center text-sm font-medium text-[#8AB661]">
                  {index + 1}
                </div>
                <p className="text-left text-gray-600">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {qrCodeUrl && (
          <div className="mb-6 flex justify-center">
            <img src={qrCodeUrl} alt="eSIM QR Code" className="w-48 h-48" />
          </div>
        )}

        <Button
          onClick={() => onDownloadComplete(true)}
          className="w-full bg-[#8AB661] hover:bg-[#7AA551] text-white py-3 rounded-lg font-medium"
        >
          {buttonText}
        </Button>

        {supportText && (
          <p className="text-sm text-gray-500 mt-4">{supportText}</p>
        )}
      </CardContent>
    </Card>
  );
};
