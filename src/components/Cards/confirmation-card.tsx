"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ConfirmationCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ConfirmationCard({
  title = "Your mobile plan is confirmed",
  subtitle = "You're all set to stay connected!",
  className = "",
}: ConfirmationCardProps) {
  return (
    <Card
      className={`w-full max-w-md bg-gray-100 rounded-3xl shadow-sm ${className}`}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
