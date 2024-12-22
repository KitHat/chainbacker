import { KickFactory } from "@/compiled_contracts/wrappers/KickFactory";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address } from "@ton/core";
import { useWallet } from "./useWallet";

export function useKickFactoryContract() {
    const { client } = useWallet();

    const kickFactoryContract = useAsyncInitialize(async () => {
        if (!client.value) return;

        const contract = new KickFactory(
            Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // Replace with your actual address
        );

        return client.value.open(contract);
    }, [client]);

    return {
        kickFactoryContract
    }
}