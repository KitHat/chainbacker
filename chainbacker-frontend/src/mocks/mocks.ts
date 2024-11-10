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
    title: 'Moonturtlez',
    totalSum: 10,
    image: './assets/logo_text.svg'
}, {
    title: 'Moonturtlez',
    totalSum: 10,
    image: './assets/logo_text.svg'
}, {
    title: 'Moonturtlez',
    totalSum: 10,
    image: './assets/logo_text.svg'
}]
