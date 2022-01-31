// eslint-disable-next-line
// @ts-nocheck
import config from "../../aws-exports"
import { UpdatedAwsConfig } from "@/lib/types/auth"

export function setAmplify(): UpdatedAwsConfig {
    const isLocalhost = process.env.NODE_ENV === "development" ? true : false

    const [localRedirectSignIn, productionRedirectSignIn] = config.oauth.redirectSignIn.split(",")

    const [localRedirectSignOut, productionRedirectSignOut] = config.oauth.redirectSignOut.split(",")

    const updatedAwsConfig = {
        ...config,
        oauth: {
            ...config.oauth,
            redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
            redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
        },
    }

    return updatedAwsConfig
}
