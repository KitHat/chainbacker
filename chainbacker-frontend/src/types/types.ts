export interface KickTier { title: string, description: string, price: number }

export type Kick = {
    id: number,
    title: string,
    raisedSum: number,
    totalSum: number,
    backersCounter: number,
    daysLeft: number,
    type: string,
    img: string,
    tiers: KickTier[]
}