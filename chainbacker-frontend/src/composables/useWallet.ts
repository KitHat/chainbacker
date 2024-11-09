import { TonClient } from "@ton/ton";
import {ref} from "vue";
import {getHttpEndpoint} from "@orbs-network/ton-access";
import { useTonAddress, useTonWallet } from '@townsquarelabs/ui-vue';

const wallet = ref<any | null>()
const walletAddress = ref<any | null>()
const walletBalance = ref<bigint | null>()
const client = ref<TonClient | null>()
export function useWallet() {
    const getClient = async () => {
        const endpoint = await getHttpEndpoint({ network: "testnet" });

        return new TonClient({ endpoint })
    }
    const initUserWallet = async () => {
        wallet.value = useTonWallet()

        walletAddress.value = useTonAddress()

        // const key = await mnemonicToWalletKey(MNEMONIC_MOCK.split(" "));
        //
        // wallet.value = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        //
        // walletAddress.value = wallet.value.address.toString({ testOnly: true })

        client.value = await getClient()
    }

    const getBalance = async () => {
        if (client.value && wallet.value) {
            walletBalance.value = await client.value.getBalance(wallet.value.address)
        }
    }

    // const sendTransaction = async () => {}

    return {
        client,
        wallet,
        initUserWallet,
        getBalance,
        walletBalance
    }
}
