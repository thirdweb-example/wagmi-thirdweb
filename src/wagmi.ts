import { http, createConfig } from "wagmi";
import { base, baseSepolia, mainnet, polygon, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export const config = createConfig({
	chains: [mainnet, sepolia, polygon, base, baseSepolia],
	connectors: [injected(), coinbaseWallet({ appName: "Create Wagmi" })],
	ssr: true,
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[polygon.id]: http(),
		[base.id]: http(),
		[baseSepolia.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
