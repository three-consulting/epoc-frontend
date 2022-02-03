// eslint-disable-next-line
// @ts-nocheck
import config from "../../aws-exports"
import { UpdatedAwsConfig } from "@/lib/types/auth"
import { PROCESS_ENV } from "../conf"

export function setAmplify(): UpdatedAwsConfig {
    const isLocalhost = PROCESS_ENV === "development"

    const [localRedirectSignIn, productionRedirectSignIn] =
        config.oauth.redirectSignIn.split(",")

    const [localRedirectSignOut, productionRedirectSignOut] =
        config.oauth.redirectSignOut.split(",")

    const updatedAwsConfig = {
        ...config,
        oauth: {
            ...config.oauth,
            redirectSignIn: isLocalhost
                ? localRedirectSignIn
                : productionRedirectSignIn,
            redirectSignOut: isLocalhost
                ? localRedirectSignOut
                : productionRedirectSignOut,
        },
    }

    return updatedAwsConfig
}
