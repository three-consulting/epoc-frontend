/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    // https://github.com/nextauthjs/next-auth/discussions/2459
    env: {
        // eslint-disable-next-line no-process-env
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
}
