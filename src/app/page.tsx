'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/components/pages/HomeScreen";
import { BrowserRouter } from "react-router-dom";

// Create a client
const queryClient = new QueryClient();

// Create a simple client-only page that doesn't use MUI in the initial render
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </QueryClientProvider>
  );
}