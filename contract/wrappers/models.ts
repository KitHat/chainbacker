export type LevelBackingData = {
    id: bigint,
    amount: bigint
}

export type Milestone = {
    part: bigint
};

export type Tier = {
    price: bigint,
    amount: bigint
}

export type CollectState = {
    target: bigint,
    collected: bigint
}

export type VoteState = {
    voted: bigint,
    target: bigint,
    inProgress: boolean,
    voteNumber: bigint
}