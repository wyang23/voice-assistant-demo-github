"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import VoiceAvatar from "../VoiceAvatar";
import MessageDisplay from "../MessageDisplay";
import { toast } from "../../hooks/use-toast";
import { useElevenLabsAgent } from "../../hooks/use-elevenlabs";
import { Button } from "../ui/button";
import { PhoneCall, Mic, PhoneOff } from "lucide-react";
import Link from "next/link";

const Index = () => {
  const [isSetup, setIsSetup] = useState(false);

  const pathname = usePathname();
  const [agentId] = useState(
    pathname === "/post-trial"
      ? "agent_01jw53asn3f7v9m1d2tsp6yhfr" // Post trial agent
      : "agent_01jvrrgs44e8brbnn7ny7pfs1e" // Default/free trial agent
  );

  const {
    startConversation,
    endConversation,
    agentMessage,
    isSpeaking,
    status,
    activeCard,
  } = useElevenLabsAgent();

  const handleStartCall = async () => {
    try {
      await startConversation(agentId);
      setIsSetup(true);

      toast({
        title: "Call Started",
        description: "Connected to virtual assistant",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const handleEndCall = async () => {
    await endConversation();
    setIsSetup(false);

    toast({
      title: "Call Ended",
      description: "Your call has been disconnected.",
    });
  };

  // Determine if user can start talking based on connection status
  const isListening = status === "connected" && !isSpeaking;

  return (
    <div className="min-h-screen flex flex-col items-center relative bg-[#f3f8f3]">
      <Link
        href="/trial-check-in"
        className="fixed bottom-4 right-4 w-3 h-3 bg-transparent z-50 cursor-default hover:cursor-pointer active:bg-[#86BC25]/5"
        aria-hidden="true"
      />
      {/* Header */}
      <div className="w-full p-4 pt-10 px-6">
        <h1 className="text-lg text-center">
          <span className="text-[#86BC25] mr-2 font-mark-pro-heavy">
            TrueConnect
          </span>
          <span className="text-black font-mark-pro">Voice Assistant</span>
        </h1>
      </div>

      {!isSetup ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm flex flex-col items-center justify-center">
            <p className="text-[#333] font-mark-pro text-center mb-40 px-6">
              Click the call button below to connect to your virtual assistant.
            </p>
            <Button
              onClick={handleStartCall}
              className="w-16 h-16 rounded-full bg-[#86BC25] hover:bg-[#86BC25]/90 text-white flex items-center justify-center shadow-md"
              size="icon"
            >
              <PhoneCall className="w-6 h-6" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col w-full max-w-lg">
          {/* Avatar section */}
          <div className="flex-1 flex flex-col items-center justify-center pb-40">
            {activeCard ? (
              <div className="max-w-md mx-auto flex flex-col items-start relative">
                <div className="absolute top-[30px] left-[30px] z-10">
                  <VoiceAvatar
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    isCardVisible={!!activeCard}
                    size={60}
                  />
                </div>
                <div className="p-6">{activeCard}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <VoiceAvatar
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  isCardVisible={!!activeCard}
                />
                {agentMessage && !agentMessage.includes("...") && (
                  <MessageDisplay message={agentMessage} />
                )}
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="fixed w-full left-0 flex justify-center gap-8 z-50 transition-all duration-300 bottom-12">
            <button
              onClick={() => {}}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isListening
                  ? "bg-[#86BC25] text-white"
                  : "bg-white text-[#86BC25]"
              } shadow-md transition-colors`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-white hover:bg-white/90 text-[#86BC25] flex items-center justify-center shadow-md border border-[#86BC25]"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
