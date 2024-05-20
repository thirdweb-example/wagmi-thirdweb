# Use thirdweb in a WAGMI application

This repo demonstrates how to use thirdweb Pay or any other thirdweb features within an existing WAGMI application.

## 1. Get an API key

Get yourself a [thirdweb API key](https://thirdweb.com/dashboard/settings/api-keys) and add it to the top of `page.tsx`. We recommend putting this in a .env file.

## 2. Setup the provider

To use the thirdweb react feature, you need to wrap your application with a `<ThirdwebProvider>` like shown in `providers.tsx`.

## 3. Convert the wagmi wallet client

Once connected with a wagmi connector, you can get the wallet client and convert it to a thirdweb compatible wallet.

Once you have a thirdweb compatible wallet, you simply set it as 'active' and all the thirdweb components and hooks will then use this active wallet.

```tsx
// This is how to set a wagmi account in the thirdweb context to use with all the thirdweb components including Pay
const { data: walletClient } = useWalletClient();
const { disconnectAsync } = useDisconnect();
const { switchChainAsync } = useSwitchChain();
const setActiveWallet = useSetActiveWallet();
useEffect(() => {
    const setActive = async () => {
        if (walletClient) {
            // adapt the walletClient to a thirdweb account
            const adaptedAccount = viemAdapter.walletClient.fromViem({
                walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
            });
            // create the thirdweb wallet with the adapted account
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
```

View the full source code in `page.tsx`.

## 4. Use thirdweb normally

You can now use <PayEmbed>, <TransactionButton> or any other thirdweb component / hook and it will use the active connected wallet to perform transactions.