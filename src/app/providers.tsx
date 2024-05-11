"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/wagmi";
import { ThirdwebProvider } from "thirdweb/react";

export function Providers(props: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<ThirdwebProvider>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					{props.children}
				</QueryClientProvider>
			</WagmiProvider>
		</ThirdwebProvider>
	);
}
