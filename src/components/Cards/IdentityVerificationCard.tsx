import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UserCheck } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FormField {
  label: string;
  type: string;
  required: boolean;
}

export interface IdentityVerificationCardProps {
  onVerificationComplete: (
    verified: boolean,
    formData?: Record<string, string>
  ) => void;
  title?: string;
  subtitle?: string;
  description?: string;
  fields?: FormField[];
  buttonText?: string;
  privacyNote?: string;
}

export const IdentityVerificationCard: React.FC<
  IdentityVerificationCardProps
> = ({
  onVerificationComplete,
  title = "Confirm your identity",
  subtitle = "Quick verification to send your eSIM",
  description = "We need to verify your identity to comply with telecommunications regulations",
  fields = [
    { label: "Full name", type: "text", required: true },
    { label: "Mobile number", type: "tel", required: true },
    { label: "Email address", type: "email", required: true },
  ],
  buttonText = "Verify identity",
  privacyNote = "Your information is secure and only used for this trial",
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field.label]: value }));
    if (errors[field.label]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.label];
        return newErrors;
      });
    }
  };

  const validateField = (field: FormField, value: string) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    } else if (
      field.type === "email" &&
      value &&
      !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ) {
      return "Please enter a valid email address";
    } else if (field.type === "tel" && value && !value.match(/^\+?[\d\s-]+$/)) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const isFormValid = () => {
    return fields.every((field) => {
      const value = formData[field.label] || "";
      return !validateField(field, value);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.label] || "");
      if (error) {
        newErrors[field.label] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onVerificationComplete(true, formData);
    }
  };

  return (
    <Card className="mx-auto bg-white rounded-2xl shadow-md border-0 max-h-[calc(100vh-180px)] flex flex-col">
      <CardContent className="p-8 flex flex-col items-center text-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="mb-6 p-4 rounded-full bg-[#8AB661] bg-opacity-10 flex-shrink-0">
          <UserCheck className="w-12 h-12 text-[#8AB661]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <h3 className="text-lg text-gray-700 mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <form className="w-full space-y-4 text-left flex-1">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label
                htmlFor={field.label}
                className="text-sm font-medium flex items-center gap-0.5"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 inline-block">*</span>
                )}
              </Label>
              <Input
                id={field.label}
                type={field.type}
                value={formData[field.label] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`w-full border rounded-lg p-2 ${
                  errors[field.label] ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
              />
              {errors[field.label] && (
                <p className="text-red-500 text-sm">{errors[field.label]}</p>
              )}
            </div>
          ))}
        </form>

        {privacyNote && (
          <p className="text-sm text-gray-500 mt-4 mb-6">{privacyNote}</p>
        )}
      </CardContent>

      <div className="p-6 pt-0 border-t mt-auto bg-white rounded-b-2xl">
        <div className="w-full space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full py-3 rounded-lg font-medium ${
              isFormValid()
                ? "bg-[#8AB661] hover:bg-[#7AA551] text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {buttonText}
          </Button>
          <Button
            onClick={() => onVerificationComplete(false)}
            variant="outline"
            className="w-full py-3 rounded-lg font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
