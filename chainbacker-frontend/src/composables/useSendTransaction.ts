import { useWallet } from "@/composables/useWallet.ts";
import { mnemonicToWalletKey } from "@ton/crypto";
import { Reputation }  from "@/compiled_contracts/wrappers/Reputation";
import { MNEMONIC_MOCK } from "@/mocks/mocks.ts";
import { JettonMinter } from "@/compiled_contracts/wrappers/JettonMinter";
import core_1, {address, Cell} from "@ton/core";
import { CONTRACT_ADDRESS_MOCK, SENDER_WALLET_MOCK, USDT_MASTER } from "@/constants/blockchainMoks.ts";
import KickContract from "@/composables/useInteractionContract.ts";
import {JettonWallet} from "@ton/ton";

const MAGIC_VALUE_MOCK = 0.05

const FORWARD_TON_AMONT_MOCK = 0.01

const DONATION_VALUE = 0.1

export const useSendTransaction = () => {
    const { wallet, client } = useWallet();
    const sendTransaction = async () => {
        if (!wallet.value || !client.value || !await client.value.isContractDeployed(wallet.value.address)) {

            return console.log("wallet is not deployed");
        }

        const key = await mnemonicToWalletKey(MNEMONIC_MOCK.split(' '));

        const walletContract = client.value.open(wallet.value);
        const walletSender = walletContract.sender(key.secretKey);

        const kickTitle = 'test title';

        const kickExpirationDate = new Date().getTime();

        const kickMoneyTarget = 500

        const tiers = [{title: 'toys', description: 'boys', price: 500}].reduce((acc, curr) => {
            acc.push([curr.price, 0])

            return acc
        }, [] as [number, number][])

        const timestamp = new Date().getTime();

        const result = await (Reputation as any).sendNewKick(walletContract, walletSender, TRANSACTION_GAS_PRICE, 124n, kickMoneyTarget, kickExpirationDate, kickTitle, timestamp, tiers);

        console.warn('result', result)

        // prepare Counter's initial code and data cells for deployment
        // const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.cell"))[0]; // compilation output from step 6
        // const initialCounterValue = Date.now(); // to avoid collisions use current number of milliseconds since epoch as initial value
        // const counter = Counter.createForDeploy(counterCode, initialCounterValue);

        // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e

        // open wallet and read the current seqno of the wallet

        // const seqno = await walletContract.getSeqno();
        // send the deploy transaction
        // const counterContract = client.open(counter);
        // await counterContract.sendDeploy(walletSender);
        //
        // await walletContract.sendTransfer({
        //     secretKey: key.secretKey,
        //     seqno: seqno,
        //     messages: [
        //         internal({
        //             to: TRANSACTION_ADDRESS_MOCK,
        //             value: "0.05", // 0.05 TON
        //             body: "Hello", // optional comment
        //             bounce: false,
        //         })
        //     ]
        // });
        //
        // let currentSeqno = seqno;
        //
        // while (currentSeqno == seqno) {
        //     console.log("waiting for transaction to confirm...");
        //     await sleep(1500);
        //     currentSeqno = await walletContract.getSeqno();
        // }
    }

    const sendBack = async () => {
        const usdtMasterAddress = address(USDT_MASTER)

        const senderWalletAddress = address(SENDER_WALLET_MOCK)

        const kickContractAddress = address(CONTRACT_ADDRESS_MOCK)

        const jettonMinter = JettonMinter.createFromAddress(usdtMasterAddress)

        if (!client.value) {
            throw new Error('client is not initialized')
        }

        const kickContractProvider = client.value.provider(kickContractAddress)

        const walletAddress = await jettonMinter.getWalletAddress(kickContractProvider, senderWalletAddress)

        const walletSender = new KickContract(senderWalletAddress)

        const forwardPayload = (0, core_1.beginCell)()
            .storeUint(0n, 8) // levelId
            .storeUint(10n, 16)
            .endCell();

        await JettonWallet.sendTransfer(kickContractProvider, walletSender, MAGIC_VALUE_MOCK, DONATION_VALUE, kickContractAddress, walletAddress, new Cell(), FORWARD_TON_AMONT_MOCK, forwardPayload)
    }

    return {
        sendBack,
        sendTransaction
    }
}
