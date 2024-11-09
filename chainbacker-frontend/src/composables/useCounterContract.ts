import { ref, watch } from 'vue';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address } from '@ton/core';
import {Reputation} from "@/compiled_contracts/wrappers/Reputation";

export function useCounterContract() {
    const client = useTonClient();

    const val = ref<number | null>(null);

    const counterContract = useAsyncInitialize(async () => {
        if (!client.value) return;

        const contract = new Reputation(
            Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // Replace with your actual address
        );

        return client.value.open(contract);
    }, [client]);

    async function getValue() {
        if (!counterContract.value) {
            return
        };

        val.value = null;

        const value = await counterContract.value.getCounter();

        val.value = Number(value);
    }

    watch(counterContract, getValue);

    return {
        value: val,
        address: counterContract.value?.address.toString(),
    };
}
