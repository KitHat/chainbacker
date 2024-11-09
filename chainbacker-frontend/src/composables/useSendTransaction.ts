// import { useWallet } from "@/composables/useWallet.ts";
// import { mnemonicToWalletKey } from "@ton/crypto";
// import { Reputation }  from "@/compiled_contracts/wrappers/Reputation";

// function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const TRANSACTION_ADDRESS_MOCK = 'EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e'
// const TRANSACTION_GAS_PRICE = 0.01;

export const useSendTransaction = () => {
    // const { wallet, client } = useWallet();
    const sendTransaction = async () => {
        // TODO: uncomment after merge with feature/send-kick

        // if (!wallet.value || !client.value || !await client.value.isContractDeployed(wallet.value.address)) {
        //
        //     return console.log("wallet is not deployed");
        // }
        //
        // const key = await mnemonicToWalletKey('mnemonic'.split(TRANSACTION_ADDRESS_MOCK));
        //
        // const walletContract = client.value.open(wallet.value);
        // const walletSender = walletContract.sender(key.secretKey);
        //
        // const kickExpirationDate = new Date().getTime();
        //
        // const kickMoneyTarget = 500
        //
        // const tiers = [{title: 'toys', description: 'boys', price: 500}].reduce((acc, curr) => {
        //     acc.push([curr.price, 0])
        //
        //     return acc
        // }, [] as [number, number][])

        // const result = await Reputation.sendNewKick(walletContract, walletSender, TRANSACTION_GAS_PRICE, 124n, kickMoneyTarget, kickExpirationDate, tiers);
        //
        // console.warn('result', result)

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

    return {
        sendTransaction
    }
}
