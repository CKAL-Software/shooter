import { refreshCredentials } from "./authenticationHandler";
import { LF_CREDENTIALS } from "./definitions";
import { Credentials } from "./models";
import * as localForage from "localforage";

export async function getAccessToken() {
  let credentials: Credentials | null;

  try {
    credentials = await localForage.getItem(LF_CREDENTIALS);
  } catch {
    throw new Error("An unexpected error occurred");
  }

  if (!credentials) {
    throw new Error("An unexpected error occurred");
  }

  if (accessTokenIsOld(credentials)) {
    credentials = await refreshCredentials(credentials.RefreshToken!);
    await localForage.setItem(LF_CREDENTIALS, credentials);
  }

  return credentials.AccessToken + "";
}

export function accessTokenIsOld(credentials: Credentials) {
  return credentials.ExpirationTimestamp - new Date().getTime() / 1000 < 300;
}

export async function clearCredentials() {
  await localForage.setItem(LF_CREDENTIALS, undefined);
}
