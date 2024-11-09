import { ref, onMounted, watch } from 'vue';

export function useAsyncInitialize(func: () => any, deps: any[] = []) {
    const state = ref<any>();

    async function initialize() {
        state.value = await func();
    }

    onMounted(initialize);

    watch(deps, initialize);

    return state;
}
