import { useWallet } from "@/composables/useWallet.ts";

import {Kick} from "@/compiled_contracts/wrappers/Kick";
import {JettonMinter} from "@/compiled_contracts/wrappers/JettonMinter";
import {KickFactory} from "@/compiled_contracts/wrappers/KickFactory";
import {address, Address, toNano} from "@ton/core";
import {useCustomFetch} from "@/composables/useCustomFetch.ts";
import {Endpoints} from "@/constants/endpoints.ts";
import {KickStage, KickType} from "@/constants/kick.ts";
import { useKickFactoryContract } from "./useKickFactoryContract";
import { useTonConnect } from "./useTonConnectUI";

export const useSendTransaction = () => {
    const { walletAddress, client, wallet } = useWallet();

    const { sender } = useTonConnect();

    const { kickFactoryContract } = useKickFactoryContract();

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

        const target = 100000000n;

        const expiration = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3);

        await kickFactoryContract.value.sendKick(sender, toNano('0.1'), 999n, target, expiration, 1n, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

        let kickAddress = await kickFactoryContract.value.getKickContract(target, expiration, 1n, sender.address, [{ part: 100n }], [{ amount: 1000n, price: 100000n }]);

        const kick = client.value.open(Kick.createFromAddress(kickAddress));

        const usdtMaster = client.value.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));

        const kickUsdtAddr = await usdtMaster.getWalletAddress(kickAddress);

        await kick.sendUsdtWallet(sender, toNano('0.05'), 2n, kickUsdtAddr);

        const res = await useCustomFetch(Endpoints.KICKS).post({
            title: form.title,
            creator: sender.address,
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
            address: kickAddress,
        }).json()

        console.warn('send kick response', res)
    }

    return {
        sendKick,
    }
}
