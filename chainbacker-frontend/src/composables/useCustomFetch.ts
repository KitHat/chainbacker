import { createFetch } from '@vueuse/core'
export const useCustomFetch = createFetch({
    baseUrl: import.meta.env.VITE_API_URL,
    combination: 'chain',
    options: {
        async onFetchError(ctx) {
            // eslint-disable-next-line no-console
            console.error('ctx', ctx)

            return ctx
        },
    },
})
