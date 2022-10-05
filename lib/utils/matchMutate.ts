import { useSWRConfig } from "swr"

export const useMatchMutate = () => {
    const { cache, mutate } = useSWRConfig()
    return (matcher: RegExp, ...args: unknown[]) => {
        if (!(cache instanceof Map)) {
            throw new Error(
                "matchMutate requires the cache provider to be a Map instance"
            )
        }

        const keys: string[] = []

        Array.from(cache.keys()).forEach((element: string) => {
            if (matcher.test(element)) {
                keys.push(element)
            }
        })

        const mutations = keys.map((key) => mutate(key, ...args))
        return Promise.all(mutations)
    }
}
