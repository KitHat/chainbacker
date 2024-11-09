import { mnemonicToWalletKey } from "@ton/crypto";
import {TonClient, WalletContractV4} from "@ton/ton";
import {ref} from "vue";
import {getHttpEndpoint} from "@orbs-network/ton-access";

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
