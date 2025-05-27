"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/components/pages/HomeScreen";
import dynamic from "next/dynamic";

// Create a client
const queryClient = new QueryClient();

// Wrap the component that needs browser APIs in dynamic import with ssr disabled
const ClientSideComponent = dynamic(() => Promise.resolve(Index), {
  ssr: false,
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientSideComponent />
    </QueryClientProvider>
  );
}
