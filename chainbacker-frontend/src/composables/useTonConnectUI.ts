import { Sender, SenderArguments } from '@ton/core';
import { useTonConnectUI } from '@townsquarelabs/ui-vue';

export function useTonConnect(): { sender: Sender; connected: boolean } {
    const { tonConnectUI, setOptions } = useTonConnectUI();

    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString('base64'),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
                });
            },
        },
        connected: tonConnectUI.connected,
    };
}