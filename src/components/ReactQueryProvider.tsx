"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
