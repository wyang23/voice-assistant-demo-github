"use client";

import { useConversation } from "@11labs/react";
import { useState, useCallback } from "react";
import { toast } from "./use-toast";
import {
  PaymentSettingsCard,
  RoamingOptionsCard,
  OptionDetailCard,
  ConfirmationCard,
  RoamingOptionDetailCard,
  PlanOptionsCard,
  ConfirmPlanCard,
} from "../components/Cards";
import { DeviceCheckCard } from "../components/Cards/DeviceCheckCard";
import { IdentityVerificationCard } from "../components/Cards/IdentityVerificationCard";
import { ESimDownloadCard } from "../components/Cards/ESimDownloadCard";
import { TrialConfirmationCard } from "../components/Cards/TrialConfirmationCard";
import React from "react";
import { Globe, MessageSquare, Phone, Receipt } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

// Common types
interface BaseProps {
  [key: string]: unknown;
}

interface PlanOption {
  subtitle: string;
  duration: string;
  minutes: number;
  texts: string;
  data: string;
  price: number;
  label: string;
}

interface PlanOptionsProps extends BaseProps {
  title: string;
  options: PlanOption[];
}

interface PlanDetailProps extends PlanOption {
  description: string;
  zones: string;
  network: string;
}

interface ConfirmPlanProps extends PlanOption {
  title: string;
  termsAndConditions: string;
}

interface ConfirmationProps extends BaseProps {
  title?: string;
  subtitle?: string;
}

// Card action types
type CardActionType =
  | { type: "deviceCheck"; isCompatible: boolean }
  | { type: "identityVerification"; verified: boolean }
  | { type: "esimDownload"; success: boolean }
  | { type: "trialConfirmation" }
  | { type: "planConfirmation"; confirmed: boolean };

// Client tools interface
interface ClientTools {
  renderDeviceCheckCard(props: BaseProps, cardType?: string): string;
  renderIdentityVerificationCard(props: BaseProps, cardType?: string): string;
  renderESimDownloadCard(props: BaseProps, cardType?: string): string;
  renderTrialConfirmationCard(props: BaseProps, cardType?: string): string;
  renderPaymentSettingsCard(
    props: BaseProps,
    cardType?: string
  ): Promise<string>;
  renderRoamingOptionsCard(props: BaseProps, cardType?: string): string;
  renderOptionDetailCard(props: BaseProps, cardType?: string): string;
  renderConfirmationCard(props: BaseProps, cardType?: string): string;
  renderRoamingOptionDetailCard(props: BaseProps, cardType?: string): string;
  renderPlanOptionsCard(props: BaseProps, cardType?: string): string;
  renderConfirmPlanCard(props: BaseProps, cardType?: string): Promise<string>;
  //renderCard(params: CardParams): Promise<string> | string;
  showAlert: (
    props: BaseProps | { message: string },
    cardType?: string
  ) => string | Promise<string>;
  [key: string]: (
    props: BaseProps | { message: string },
    cardType?: string
  ) => string | Promise<string>;
}

export function useElevenLabsAgent() {
  const [agentMessage, setAgentMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeCard, setActiveCard] = useState<React.ReactNode>(null);
  const [waitingForCardAction, setWaitingForCardAction] = useState(false);
  const [cardAction, setCardAction] = useState<CardActionType | null>(null);

  // Create client tools
  const clientTools: ClientTools = {
    renderPaymentSettingsCard: async ({
      title,
      buttonText,
    }: any): Promise<string> => {
      console.log("Rendering payment settings card");
      setWaitingForCardAction(true);

      return new Promise<string>((resolve) => {
        setActiveCard(
          <PaymentSettingsCard
            title={title || "Payment settings"}
            buttonText={buttonText || "Update payment settings"}
            onUpdate={() => {
              console.log("Payment settings update button clicked");
              setWaitingForCardAction(false);
              resolve("updated");
            }}
          />
        );
      });
    },

    renderRoamingOptionsCard: (props: any): string => {
      console.log(`Rendering roaming options card: ${JSON.stringify(props)}`);

      try {
        // Parse props if they're provided as a string
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;

        setActiveCard(<RoamingOptionsCard {...parsedProps} />);
        return "rendered";
      } catch (error) {
        console.error(`Error parsing props: ${error}`);
        return "error";
      }
    },

    renderPlanOptionsCard: (props: PlanOptionsProps): string => {
      console.log("Rendering plan options card");
      setActiveCard(
        <PlanOptionsCard title={props.title} options={props.options} />
      );
      return "rendered";
    },

    renderOptionDetailCard: (props: PlanDetailProps): string => {
      console.log("Rendering option detail card");
      setActiveCard(<OptionDetailCard {...props} />);
      return "rendered";
    },

    renderConfirmPlanCard: (props: ConfirmPlanProps): Promise<string> => {
      console.log("Rendering confirm plan card");
      setWaitingForCardAction(true);

      return new Promise<string>((resolve) => {
        setActiveCard(
          <ConfirmPlanCard
            {...props}
            onActivate={() => {
              console.log("Plan confirmed");
              setWaitingForCardAction(false);
              setCardAction({ type: "planConfirmation", confirmed: true });
              conversation.sendUserMessage(`Plan Confirmed: true`);
              resolve("confirmed");
            }}
          />
        );
      });
    },

    renderConfirmationCard: (props: ConfirmationProps): string => {
      console.log("Rendering confirmation card");
      setActiveCard(
        <ConfirmationCard title={props.title} subtitle={props.subtitle} />
      );
      return "rendered";
    },

    renderRoamingOptionDetailCard: (props: any): string => {
      console.log(
        `Rendering roaming option detail card: ${JSON.stringify(props)}`
      );

      try {
        // Parse props if they're provided as a string
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;

        if (parsedProps.features) {
          parsedProps.features = parsedProps.features.map((feature: any) => ({
            ...feature,
            icon: getIconComponent(feature.icon),
          }));
        }

        setActiveCard(<RoamingOptionDetailCard {...parsedProps} />);
        return "rendered";
      } catch (error) {
        console.error(`Error parsing props: ${error}`);
        return "error";
      }
    },

    renderDeviceCheckCard: (props: BaseProps, cardType?: string): string => {
      console.log(
        `Rendering device check card type: ${cardType}, props:`,
        props
      );

      try {
        setWaitingForCardAction(true);

        const deviceCheckProps = {
          ...props,
          cardType: cardType as
            | "deviceCompatible"
            | "deviceIncompatible"
            | "deviceCheckUncertain",
          onCheckComplete: (result: {
            status: "compatible" | "incompatible" | "uncertain";
            deviceInfo?: string;
          }) => {
            console.log("Device check complete:", result);
            setWaitingForCardAction(false);
            conversation.sendUserMessage(
              `Device check complete: ${result.status}`
            );
            setActiveCard(null);
            setCardAction({
              type: "deviceCheck",
              isCompatible: result.status === "compatible",
            });
          },
        };

        setActiveCard(<DeviceCheckCard {...deviceCheckProps} />);
        return "rendered";
      } catch (error) {
        console.error(`Error in renderDeviceCheckCard:`, error);
        return "error";
      }
    },

    renderIdentityVerificationCard: (props: any): string => {
      console.log(
        `Rendering identity verification card: ${JSON.stringify(props)}`
      );

      try {
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;
        setWaitingForCardAction(true);

        setActiveCard(
          <IdentityVerificationCard
            {...parsedProps}
            onVerificationComplete={(
              verified: boolean,
              formData?: Record<string, string>
            ) => {
              console.log(
                "Identity verification complete:",
                verified,
                formData
              );
              setWaitingForCardAction(false);
              conversation.sendUserMessage(
                `Identity verification complete: ${
                  verified ? "Verified" : "Not Verified"
                }${formData ? ` with data: ${JSON.stringify(formData)}` : ""}`
              );
              setActiveCard(null);
            }}
          />
        );
        return "rendered";
      } catch (error) {
        console.error(`Error parsing props: ${error}`);
        return "error";
      }
    },

    renderESimDownloadCard: (props: any): string => {
      console.log(`Rendering eSIM download card: ${JSON.stringify(props)}`);

      try {
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;
        setWaitingForCardAction(true);

        setActiveCard(
          <ESimDownloadCard
            {...parsedProps}
            onDownloadComplete={(success) => {
              console.log("eSIM download complete:", success);
              setWaitingForCardAction(false);
              conversation.sendUserMessage(
                `eSIM download complete: ${success ? "Success" : "Failed"}`
              );
              setActiveCard(null);
            }}
          />
        );
        return "rendered";
      } catch (error) {
        console.error(`Error parsing props: ${error}`);
        return "error";
      }
    },

    renderTrialConfirmationCard: (props: any): string => {
      console.log(
        `Rendering trial confirmation card: ${JSON.stringify(props)}`
      );

      try {
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;
        setWaitingForCardAction(true);

        setActiveCard(
          <TrialConfirmationCard
            {...parsedProps}
            onConfirm={() => {
              console.log("Trial confirmed");
              setWaitingForCardAction(false);
              conversation.sendUserMessage("Trial confirmation complete");
              setActiveCard(null);
            }}
          />
        );
        return "rendered";
      } catch (error) {
        console.error(`Error parsing props: ${error}`);
        return "error";
      }
    },

    renderCard: ({ cardType, props }: CardParams): Promise<string> | string => {
      console.log(`renderCard called with type: ${cardType}`);
      try {
        const parsedProps =
          typeof props === "string" ? JSON.parse(props) : props;
        console.log("🚀 ~ useElevenLabsAgent ~ parsedProps:", parsedProps);

        switch (cardType) {
          case "deviceCompatible":
          case "deviceIncompatible":
          case "deviceCheckUncertain":
            return clientTools.renderDeviceCheckCard(
              {
                ...parsedProps,
                cardType,
              },
              cardType
            );
          case "identityVerification":
            return clientTools.renderIdentityVerificationCard(parsedProps);
          case "esimDownload":
            return clientTools.renderESimDownloadCard(parsedProps);
          case "trialConfirmation":
            return clientTools.renderTrialConfirmationCard(parsedProps);
          case "paymentSettings":
            return clientTools.renderPaymentSettingsCard(parsedProps);
          case "roamingOptions":
            return clientTools.renderRoamingOptionsCard(parsedProps);
          case "planOptions":
            return clientTools.renderPlanOptionsCard(parsedProps);
          case "optionDetail":
            return clientTools.renderOptionDetailCard(parsedProps);
          case "confirmPlan":
            return clientTools.renderConfirmPlanCard(parsedProps);
          case "confirmation":
            return clientTools.renderConfirmationCard(parsedProps);
          // Legacy support for old card types
          case "options":
            return clientTools.renderRoamingOptionsCard(parsedProps);
          case "paymentSettings":
            return clientTools.renderPaymentSettingsCard(parsedProps);
          case "roamingOptionDetail":
            return clientTools.renderRoamingOptionDetailCard(parsedProps);
          default:
            console.warn(`Unknown card type: ${cardType}`);
            return "unknown_card_type";
        }
      } catch (error) {
        console.error(`Error in renderCard: ${error}`);
        return "error";
      }
    },

    showAlert: (props: BaseProps | { message: string }): string => {
      const message =
        typeof props === "string"
          ? props
          : "message" in props
          ? props.message
          : "";
      toast({
        title: "Alert",
        description: message,
      });
      return "displayed";
    },
  };

  // Helper function for icon components
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "globe":
        return <Globe className="h-5 w-5 text-teal-600" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-teal-600" />;
      case "phone":
        return <Phone className="h-5 w-5 text-teal-600" />;
      case "receipt":
        return <Receipt className="h-5 w-5 text-teal-600" />;
      default:
        return <Globe className="h-5 w-5 text-teal-600" />;
    }
  };

  const conversation = useConversation({
    apiKey: API_KEY,
    webSocketUrl: "wss://api.elevenlabs.io/v1/convai/conversation",
    sendUserMessage: () => {
      console.log("Sending contextual update");
    },
    onConnect: () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Connected to ElevenLabs Agent",
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
      setActiveCard(null); // Clear the active card
      toast({
        title: "Disconnected",
        description: "Disconnected from ElevenLabs Agent",
      });
    },
    onMessage: (message) => {
      if (message.source === "user") {
        console.time("message");
      }
      if (message.source === "ai") {
        console.timeEnd("message");
      }
      console.log(message);
      // TODO: This will be changed when swapping to custom LLM
      if (message.source === "ai") {
        setAgentMessage(message.message);
      }
    },
    onError: (error) => {
      console.error("WebSocket Error:", error);
      toast({
        title: "Error",
        description:
          error || "An error occurred with the ElevenLabs conversation",
        variant: "destructive",
      });
    },
  });

  const startConversation = useCallback(
    async (agentId: string) => {
      try {
        if (!API_KEY) {
          throw new Error("ElevenLabs API key is not configured");
        }
        await conversation.startSession({
          agentId,
          headers: {
            "xi-api-key": API_KEY,
          },
          clientTools: clientTools,
        });
      } catch (error) {
        console.error("Connection error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to ElevenLabs Agent",
          variant: "destructive",
        });
        throw error;
      }
    },
    [conversation]
  );

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  }, [conversation]);

  const setVolume = useCallback(
    (volume: number) => {
      conversation.setVolume({ volume: Math.min(Math.max(volume, 0), 1) });
    },
    [conversation]
  );

  return {
    startConversation,
    endConversation,
    setVolume,
    agentMessage,
    isConnected,
    isSpeaking: conversation.isSpeaking,
    status: conversation.status,
    activeCard,
    cardAction,
  };
}
