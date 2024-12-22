import { useWallet } from "@/composables/useWallet.ts";

import {JettonMinter} from "@/compiled_contracts/wrappers/JettonMinter";
import { Address, beginCell, Cell, toNano } from "@ton/core";
import {useCustomFetch} from "@/composables/useCustomFetch.ts";
import {Endpoints} from "@/constants/endpoints.ts";
import {KickStage, KickType} from "@/constants/kick.ts";
import { useKickFactoryContract } from "./useKickFactoryContract";
import { useTonConnect } from "./useTonConnectUI";
import { JettonWallet } from "@/compiled_contracts/wrappers/JettonWallet";

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

        const target = form.totalSum;

        const expiration = BigInt(Math.floor(form.expirationDate.getTime() / 1000));

        const tiers = form.tiers.map((item) => {
            return {
                amount: 1000n,
                price: BigInt(item.price)
            };
        });
        const usdtMaster = client.value.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));

        let parts = divideParts(form.milestones.length);

        let kickAddress = await kickFactoryContract.value.getKickContract(target, expiration, sender.address, parts, tiers);
        let usdtAddress = await usdtMaster.getWalletAddress(kickAddress);

        await kickFactoryContract.value.sendKick(sender, toNano('0.1'), BigInt(Math.floor(Math.random() * 10000000)), target, expiration, usdtAddress, parts, tiers);

        const res = await useCustomFetch(Endpoints.KICKS).post({
            title: form.title,
            creator: sender.address,
            description: form.description,
            type: KickType.Tech,
            expirationDate: form.expirationDate.getTime(),
            totalSum: form.totalSum,
            raisedSum: 0,
            file: '',
            tiers: form.tiers.map(item => ({
                ...item,
                limit: 1000,
                bought: 0
            })),
            milestones: form.milestones.map((item, index) => ({ date: item.date.getTime(), description: item.description, part: index + 1 })),
            status: KickStage.Active,
            address: kickAddress,
        }).json()

        console.warn('send kick response', res)
    }

    const sendBack = async (form: {
        kick: string, // address
        level: number,
        amount: number,
        levelPrice: number
    }) => {
        if (!client.value) {
            throw new Error('client is undefined')
        }

        let transfer = BigInt(form.amount * form.levelPrice);
        let forwardPayload = beginCell().storeUint(form.level, 8).storeUint(form.amount, 16).endCell();

        const usdtMaster = client.value.open(JettonMinter.createFromAddress(Address.parse("kQAMGZKPIODMJq4UV3glLkLA60D1qEHfCuCbkKhwYX2DKLBa")));
        const kickAddress = Address.parse(form.kick);
        const userAddress = Address.parse(walletAddress.value);
        const userUsdtAddress = await usdtMaster.getWalletAddress(userAddress);
        const userUsdtWallet = client.value.open(JettonWallet.createFromAddress(userUsdtAddress));
        await userUsdtWallet.sendTransfer(sender, toNano('0.05'), transfer, kickAddress, userAddress, Cell.EMPTY, toNano('0.03'), forwardPayload);
    }

    return {
        sendKick,
        sendBack
    }
}

function divideParts(numParts: number): { part: number }[] {
    // For single part, return 100
    if (numParts === 1) {
        return [{ part: 100 }];
    }

    const result: { part: number }[] = [];

    // Calculate the base part value (floor division)
    const basePart = Math.floor(100 / numParts);

    // Calculate the remainder to add to the last part
    const remainder = 100 - (basePart * numParts);

    // Fill array with base parts
    for (let i = 0; i < numParts - 1; i++) {
        result.push({ part: basePart });
    }

    // Add the last part with the remainder
    result.push({ part: basePart + remainder });

    return result;
}
