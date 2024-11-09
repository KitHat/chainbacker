import { ref, watch, onMounted } from 'vue';
import Counter from '../contracts/counter';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address } from '@ton/core';

export function useCounterContract() {
    const client = useTonClient();

    const val = ref(null);

    const counterContract = useAsyncInitialize(async () => {
        if (!client.value) return;

        const contract = new Counter(
            Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb') // Replace with your actual address
        );

        return client.value.open(contract);
    }, [client]);

    async function getValue() {
        if (!counterContract.value) return;
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
