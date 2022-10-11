import * as AWS from "aws-sdk";
import { getAccessToken } from "./credentialsHandler";
import { AWS_CLIENT_ID, LF_CREDENTIALS } from "./definitions";
import { Credentials, UserInfo } from "./models";
import * as localForage from "localforage";

const Cognito = new AWS.CognitoIdentityServiceProvider({ region: "eu-west-1" });

export async function login(email: string, password: string) {
  const response = await Cognito.initiateAuth({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: AWS_CLIENT_ID,
    AuthParameters: { USERNAME: email, PASSWORD: password },
  }).promise();

  if (!response.AuthenticationResult) {
    throw new Error("An unexpected error occurred");
  }

  await localForage.setItem(LF_CREDENTIALS, {
    ...response.AuthenticationResult,
    ExpirationTimestamp: Math.round(new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!),
  });
}

export async function refreshCredentials(refreshToken: string): Promise<Credentials> {
  const response = await Cognito.initiateAuth({
    AuthFlow: "REFRESH_TOKEN",
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  }).promise();

  if (!response.AuthenticationResult) {
    throw new Error("An unexpected error occurred");
  }

  return {
    ...response.AuthenticationResult,
    RefreshToken: refreshToken,
    ExpirationTimestamp: Math.round(new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!),
  };
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await Cognito.getUser({
    AccessToken: await getAccessToken(),
  }).promise();

  return {
    email: response.UserAttributes.find((a) => a.Name === "email")?.Value || "",
    firstname: response.UserAttributes.find((a) => a.Name === "custom:firstname")?.Value || "",
    lastname: response.UserAttributes.find((a) => a.Name === "custom:lastname")?.Value || "",
    nickname: response.UserAttributes.find((a) => a.Name === "custom:nickname")?.Value || "",
  };
}
