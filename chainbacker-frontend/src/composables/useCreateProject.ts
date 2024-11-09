import { ref } from "vue";
export const useCreateProject = () => {
    const isLoading = ref(false)

    // const createKick = () => {
    //
    // }
    const createKickInBlockchain = () => {


        // Reputation.sendNewKick()
    }

    return {
        isLoading,
        createKickInBlockchain
    }
}
