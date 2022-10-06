import { useSWRConfig } from "swr"

export const useMatchMutate = () => {
    const { cache, mutate } = useSWRConfig()
    return (endpoint: string, ...args: unknown[]) => {
        if (!(cache instanceof Map)) {
            throw new Error(
                "matchMutate requires the cache provider to be a Map instance"
            )
        }

        const matcher = new RegExp(`^/${endpoint}([/|?].+)?`)

        const keys: string[] = []

        Array.from(cache.keys()).forEach((key: string) => {
            if (matcher.test(key) || key === endpoint) {
                keys.push(key)
            }
        })

        const mutations = keys.map((key) => mutate(key, ...args))
        return Promise.all(mutations)
    }
}
