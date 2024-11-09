import { Reputation }  from "@/compiled_contracts/wrappers/Reputation";
import {ref} from "vue";
export const useCreateProject = () => {
    console.warn('Reputation', Reputation)

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
