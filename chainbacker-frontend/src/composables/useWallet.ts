import { TonClient } from "@ton/ton";
import {computed, ref, unref} from "vue";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useTonAddress, useTonWallet } from '@townsquarelabs/ui-vue';
import {address} from "@ton/core";

const wallet = ref<any | null>()
const walletAddress = computed(() => useTonAddress().value)
const walletBalance = ref<bigint | null>()
const client = ref<TonClient | null>()
export function useWallet() {
    const getClient = async () => {
        const endpoint = await getHttpEndpoint({ network: "testnet" });

        return new TonClient({ endpoint })
    }
    const initUserWallet = async () => {
        console.log("initializing user wallet");
        wallet.value = unref(useTonWallet())
        console.log(wallet.value)

        client.value = await getClient()
    }

    const getBalance = async () => {
        if (client.value && wallet.value) {
            walletBalance.value = await client.value.getBalance(address(walletAddress.value))
        }
    }

    // const sendTransaction = async () => {}

    return {
        client,
        wallet,
        initUserWallet,
        getBalance,
        walletBalance,
        walletAddress
    }
}
