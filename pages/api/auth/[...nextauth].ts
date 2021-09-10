import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
    providers: [
        Providers.Cognito({
            clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET,
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
        }),
    ],
    session: { jwt: true },
    jwt: {
        secret: process.env.SECRET,
        signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    },
});
