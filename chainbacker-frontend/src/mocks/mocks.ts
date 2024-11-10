import JSON_CARD_MOCKS from '@/mocks/kicks.json';
import {reactive} from "vue";

export const MANIFEST_URL_MOCK = 'https://kithat.github.io/deton8/tonconnect-manifest.json';
export const MNEMONIC_MOCK = "fuel indicate deliver sniff version fragile voice glad comfort destroy merge dinner oppose mention random cloth clay fossil dutch jungle cart man august confirm"

export const CARDS_MOCK = reactive(JSON_CARD_MOCKS)

export const DETONATE_CARDS_MOCK = [
    {
        id: 1,
        title: 'Light',
        raisedSum: 492,
        totalSum: 500,
        backersCounter: 450,
        daysLeft: 3,
        type: 'EdTech',
        img: '',
        tiers: [{
            title: '',
            description: '',
            sum: 0
        }]
    },
    {
        id: 2,
        title: 'Dark',
        raisedSum: 499,
        totalSum: 500,
        backersCounter: 450,
        daysLeft: 2,
        type: 'EdTech',
        img: ''
    },
    {
        id: 3,
        title: 'Light',
        raisedSum: 495,
        totalSum: 500,
        backersCounter: 450,
        daysLeft: 1,
        type: 'EdTech',
        img: ''
    }
 ]

export const MOST_ACTIVE_PROJECTS_MOCK = [{
    title: 'Chibi Santa',
    totalSum: 50,
    image: 'https://i.kickstarter.com/assets/047/017/107/29cb310d476e3f8ff605fad45ab83e99_original.png?fit=scale-down&origin=ugc&width=680&sig=3yX8nBeEi8uqTNSALL4%2F3saUQPvwzMe2kBA5Sej9fbM%3D'
}, {
    title: 'Smart Pet',
    totalSum: 500,
    image: 'https://i.kickstarter.com/assets/046/813/787/2919509e11a45ea39f196b1eb643ef0d_original.png?fit=scale-down&origin=ugc&width=680&sig=fhj3%2FZoq4WOfborGcPSfGb3MKU%2BPdmWeqshWSrrJqh0%3D'
}, {
    title: 'Eco-Friend',
    totalSum: 1000,
    image: 'https://i.kickstarter.com/assets/046/884/810/04556a878b4f31262b236fd5a8188fa1_original.jpg?origin=ugc&q=80&width=600&sig=TyVkBaJCkZflWkG65h%2FLrYy9lDHj%2BT9Y2J2rOKsfQBs%3D'
}]
