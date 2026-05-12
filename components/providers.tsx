"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { useAuth } from "@/lib/auth-store";

export function Providers({ children }: { children: React.ReactNode }) {
 const [client] = useState(
 () =>
 new QueryClient({
 defaultOptions: {
 queries: {
 staleTime: 30_000,
 refetchOnWindowFocus: false,
 retry: 1,
 },
 },
 })
 );
 const hydrate = useAuth((s) => s.hydrate);

 useEffect(() => {
 void hydrate();
 }, [hydrate]);

 return (
 <QueryClientProvider client={client}>
 {children}
 <Toaster position="top-center" richColors />
 {process.env.NODE_ENV === "development" && (
 <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
 )}
 </QueryClientProvider>
 );
}
