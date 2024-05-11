"use client";

import { useEffect } from "react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { viemAdapter } from "thirdweb/adapters/viem";
import { useSetActiveWallet, PayEmbed } from "thirdweb/react";
import { createWalletAdapter } from "thirdweb/wallets";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWalletClient } from "wagmi";

const client = createThirdwebClient({
	clientId: "3514d1019082c2ea71ed1e367fd20af0", //"your-client-id",
});

function App() {
	const account = useAccount();
	const { connectors, connect, status, error } = useConnect();
	const { disconnectAsync } = useDisconnect();

	// This is how to set a wagmi account in the thirdweb context to use with all the thirdweb components including Pay
	const { data: walletClient } = useWalletClient();
	const { switchChainAsync } = useSwitchChain();
	const setActiveWallet = useSetActiveWallet();
	useEffect(() => {
		const setActive = async () => {
			if (walletClient) {
				const adaptedAccount = viemAdapter.walletClient.fromViem({
					walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
				});
				const w = createWalletAdapter({
					adaptedAccount,
					chain: defineChain(await walletClient.getChainId()),
					client,
					onDisconnect: async () => {
						await disconnectAsync();
					},
					switchChain: async (chain) => {
						await switchChainAsync({ chainId: chain.id as any });
					},
				});
				setActiveWallet(w);
			}
		};
		setActive();
	}, [walletClient]);

	return (
		<>
			<div>
				<h2>Account</h2>

				<div>
					status: {account.status}
					<br />
					addresses: {JSON.stringify(account.addresses)}
					<br />
					chainId: {account.chainId}
				</div>

				{account.status === "connected" && (
					<button type="button" onClick={async () => { await disconnectAsync() }}>
						Disconnect
					</button>
				)}
			</div>

			<div>
				<h2>Connect</h2>
				{connectors.map((connector) => (
					<button
						key={connector.uid}
						onClick={() => connect({ connector })}
						type="button"
					>
						{connector.name}
					</button>
				))}
				<div>{status}</div>
				<div>{error?.message}</div>
			</div>

      <div>
      <h2>thirdweb Pay</h2>
       <PayEmbed client={client} />  
      </div>
		</>
	);
}

export default App;
