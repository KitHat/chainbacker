import {useWallet} from "@/composables/useWallet.ts";
import { internal } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const TRANSACTION_ADDRESS_MOCK = 'EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e'
export const useSendTransaction = () => {
    const { wallet, client } = useWallet();
    const sendTransaction = async () => {
        if (!await client.isContractDeployed(wallet.address)) {

            return console.log("wallet is not deployed");
        }

        const key = await mnemonicToWalletKey(mnemonic.split(TRANSACTION_ADDRESS_MOCK));

        // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
        const walletContract = client.open(wallet);

        const seqno = await walletContract.getSeqno();

        await walletContract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: TRANSACTION_ADDRESS_MOCK,
                    value: "0.05", // 0.05 TON
                    body: "Hello", // optional comment
                    bounce: false,
                })
            ]
        });

        let currentSeqno = seqno;

        while (currentSeqno == seqno) {
            console.log("waiting for transaction to confirm...");
            await sleep(1500);
            currentSeqno = await walletContract.getSeqno();
        }

        console.log("transaction confirmed!");
    }

    return {
        sendTransaction
    }
}
