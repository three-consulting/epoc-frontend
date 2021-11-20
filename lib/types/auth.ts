import { CognitoUser } from '@aws-amplify/auth';
import { ICredentials } from '@aws-amplify/core';

// See this issue regarding the Amplify library and types
// https://github.com/aws-amplify/amplify-js/issues/4927
interface UserAttributes {
    sub: string;
    email: string;
    email_verified: string;
    name: string;
    updated_at: string;
}

export interface CognitoUserExt extends CognitoUser {
    attributes: UserAttributes;
}

export interface AuthState {
    user?: CognitoUserExt;
    signIn?(): Promise<ICredentials>;
    signOut?(): Promise<void>;
}

// type interface for the object in the gitignored file aws-exports.js
// found in the project root
export interface UpdatedAwsConfig {
    aws_project_region: string;
    aws_cognito_identity_pool_id: string;
    aws_cognito_region: string;
    aws_user_pools_id: string;
    aws_user_pools_web_client_id: string;
    oauth: {
        redirectSignIn: string;
        redirectSignOut: string;
        domain: string;
        scope: string[];
        responseType: string;
    };
    federationTarget: string;
    aws_cognito_username_attributes: string[];
    aws_cognito_social_providers: string[];
    aws_cognito_signup_attributes: string[];
    aws_cognito_mfa_configuration: string;
    aws_cognito_mfa_types: string[];
    aws_cognito_password_protection_settings: {
        passwordPolicyMinLength: number;
        passwordPolicyCharacters: string[];
    };
    aws_cognito_verification_mechanisms: string[];
}
