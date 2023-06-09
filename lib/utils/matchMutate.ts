import { useSWRConfig } from "swr"

export const useMatchMutate = () => {
    const { cache, mutate } = useSWRConfig()
    return (fun: (key: string) => boolean, ...args: unknown[]) => {
        if (!(cache instanceof Map)) {
            throw new Error(
                "matchMutate requires the cache provider to be a Map instance"
            )
        }

        const keys: string[] = []

        Array.from(cache.keys()).forEach((element: string) => {
            if (fun(element)) {
                keys.push(element)
            }
        })

        const mutations = keys.map((key) => mutate(key, ...args))
        return Promise.all(mutations)
    }
}
