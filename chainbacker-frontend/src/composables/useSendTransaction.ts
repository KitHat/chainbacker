import { useWallet } from "@/composables/useWallet.ts";

import {Kick} from "@/compiled_contracts/wrappers/Kick";
import {JettonMinter} from "@/compiled_contracts/wrappers/JettonMinter";
import {KickFactory} from "@/compiled_contracts/wrappers/KickFactory";
import {address, Address, toNano} from "@ton/core";
import {useCustomFetch} from "@/composables/useCustomFetch.ts";
import {Endpoints} from "@/constants/endpoints.ts";
import {KickStage, KickType} from "@/constants/kick.ts";

export const useSendTransaction = () => {
    const { walletAddress, client, wallet } = useWallet();
    const sendKick = async (form: {
        title: string;
        description: string;
        expirationDate: Date;
        totalSum: number;
        file: string;
        tiers: { title: string; description: string; price: number }[];
        milestones: {date: Date; description: string}[];
    }) => {
        if (!client.value) {
          throw new Error('client is undefined')
        }

        console.warn('sendKick', walletAddress.value, client.value)

        const senderAddress = address(walletAddress.value)

        const provider = client.value.provider(senderAddress)

        const sender = client.value.open(wallet.value).sender;

        const target = 100000000n;

        const expiration = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3);

        const kickFactory = provider.open(KickFactory.createFromAddress(Address.parse("EQBk2uXgGwdFWCZQ1j5WvuEVTIUSbD6vEtc9suHKpBZzhOji")));

        await kickFactory.sendKick(sender, toNano('0.1'), 999n, target, expiration, 1n, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

        let kickAddress = await kickFactory.getKickContract(target, expiration, 1n, senderAddress, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

        const reputation = provider.open(Kick.createFromAddress(kickAddress));

        const usdtMaster = provider.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));

        const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);

        await reputation.sendUsdtWallet(sender, toNano('0.05'), 2n, kickUsdtAddr);

        const res = await useCustomFetch(Endpoints.KICKS).post({
            title: form.title,
            creator: 'detoner',
            description: form.description,
            type: KickType.Tech,
            expirationDate: form.expirationDate.getTime(),
            totalSum: form.totalSum,
            raisedSum: 0,
            file: '',
            tiers: form.tiers.map(item => ({...item, limit: 1,
                bought: 1})),
            milestones: form.milestones.map((item, index) => ({ date: item.date.getTime(), description: item.description, part: index + 1 })),
            status: KickStage.Active,
            address: 'deployed address kick',
        }).json()

        console.warn('send kick response', res)
    }

    return {
        sendKick,
    }
}
