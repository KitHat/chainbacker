const CAT_MAPPING = new Map<string, string>([
    ['art', 'Art & Design'],
    ['tech', 'Technology & Gadgets']
])

export const transformKick = (item: any) => ({
    id: item.address,
    title: item.title,
    status: item.stage,
    description: item.description,
    raisedSum: item.raisedSum,
    totalSum: item.totalSum,
    backersCounter: 452, // TODO: calculate on backend
    daysLeft: Math.floor((item.expirationDate - Date.now() / 1000) / 86400),
    type: CAT_MAPPING.get(item.type),
    tiers: item.tiers,
    file: item.file
})
