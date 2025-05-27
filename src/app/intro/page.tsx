import { ArrowLeft, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

//This is purely for demo purposes
export default function Page() {
  return (
    <div className="max-w-sm mx-auto bg-black rounded-[2.5rem] p-2">
      <div className="bg-white rounded-[2.25rem] overflow-hidden h-[800px] flex flex-col">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1 text-black text-sm font-medium">
          <div className="text-left">9:41</div>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <svg className="w-6 h-4 ml-1" viewBox="0 0 24 16" fill="none">
              <rect
                x="1"
                y="3"
                width="18"
                height="10"
                rx="2"
                stroke="black"
                strokeWidth="1"
                fill="none"
              />
              <rect x="20" y="6" width="2" height="4" rx="1" fill="black" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
              <ArrowLeft className="w-5 h-5 text-blue-500" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">TC</span>
              </div>
              <div>
                <div className="font-medium text-black">TeleConnect</div>
                <div className="text-xs text-gray-500">Mobile Carrier</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
              <Video className="w-5 h-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
              <Phone className="w-5 h-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
              <Info className="w-5 h-5 text-blue-500" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          <div className="text-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Today 2:34 PM
            </span>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[280px] bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-black text-[15px] leading-5">
                <span className="font-semibold">
                  {`Network Down? We've Got You!`}
                </span>
                <br />
                <br />
                Sooo, we noticed your network is down again. Try us as a backup
                — a free 3-day esim plan on us. No waiting and no strings
                attached.
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[280px] bg-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-black text-[15px] leading-5">
                Try out our new voice assistant helper:
              </p>
              <br />
              <Link
                href="/"
                className="text-black text-[15px] leading-5 font-semibold hover:text-blue-500 transition-colors underline"
              >
                https://trueconnect-voice-assistant
              </Link>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Text Message"
                className="w-full bg-transparent text-black placeholder-gray-500 text-[16px] outline-none"
              />
            </div>
            <Button
              size="icon"
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
