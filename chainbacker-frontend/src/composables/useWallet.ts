import { mnemonicToWalletKey } from "@ton/crypto";
import {TonClient, WalletContractV4} from "@ton/ton";
import {ref} from "vue";
import {getHttpEndpoint} from "@orbs-network/ton-access";

export const MNEMONIC_MOCK = "fuel indicate deliver sniff version fragile voice glad comfort destroy merge dinner oppose mention random cloth clay fossil dutch jungle cart man august confirm"

const wallet = ref<WalletContractV4 | null>()
const walletAddress = ref<string | null>()
const walletBalance = ref<bigint | null>()
const client = ref<TonClient | null>()
export function useWallet() {
    const getClient = async () => {
        const endpoint = await getHttpEndpoint({ network: "testnet" });

        return new TonClient({ endpoint })
    }
    const initUserWallet = async () => {
        if (wallet.value) {
           return
        }

        const key = await mnemonicToWalletKey(MNEMONIC_MOCK.split(" "));

        wallet.value = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

        walletAddress.value = wallet.value.address.toString({ testOnly: true })

        client.value = await getClient()
    }

    const getBalance = async () => {
        if (client.value && wallet.value) {
            walletBalance.value = await client.value.getBalance(wallet.value.address)
        }
    }

    // const sendTransaction = async () => {}

    return {
        wallet,
        initUserWallet,
        getBalance,
        walletBalance
    }
}
export async function getWalletAddress() {
    // open wallet v4 (notice the correct wallet version here)
    const mnemonic = "fuel indicate deliver sniff version fragile voice glad comfort destroy merge dinner oppose mention random cloth clay fossil dutch jungle cart man august confirm"; // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    wallet.value = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
}
