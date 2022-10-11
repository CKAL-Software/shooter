import { getAccessToken } from "./credentialsHandler";
import { BACKEND_URL, TICK_DURATION } from "./definitions";
import { LeaderboardEntry } from "./models";

export async function doFetch(
  httpMethod: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  onOK: (json: any) => void,
  onNotOK: (json: any) => void,
  finallyCallback?: () => void,
  body?: any,
  customUrl?: boolean
) {
  try {
    const response = await fetch(`${customUrl ? path : BACKEND_URL + path}`, {
      headers: await getHeaders(),
      method: httpMethod,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.ok) {
      try {
        onOK(await response.json());
      } catch {
        onOK(`${response.status} ${response.statusText}`);
      }
    } else {
      try {
        onNotOK(await response.json());
      } catch (error) {
        onNotOK(response.statusText);
      }
    }
  } catch (error) {
    console.log(error);
    onNotOK("An error occured");
  } finally {
    if (finallyCallback) {
      finallyCallback();
    }
  }
}

export async function getHeaders(extraHeaders?: any) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", await getAccessToken());

  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, val]) => headers.append(key, val + ""));
  }

  return headers;
}

export function toDateAndTime(
  timestamp: number | undefined,
  withYear?: boolean,
  excludeTime?: boolean,
  onlyYear?: boolean
) {
  if (!timestamp) {
    return "No date";
  }

  const date = new Date(timestamp);
  const day = `${date.getDate()}/${date.getMonth() + 1}`;
  const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  const year = date.getFullYear().toString().slice(2);

  if (onlyYear) {
    return date.getFullYear().toString();
  }

  return `${day}${withYear ? `-${year}` : ""}${excludeTime ? "" : " " + time}`;
}

export function leaderboardEntryComparator(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (a.won !== b.won) {
    return Number(b.won) - Number(a.won);
  }

  if (a.won) {
    // win case
    if (a.lives !== b.lives) {
      return b.lives - a.lives;
    }

    if (a.ticks !== b.ticks) {
      return a.ticks - b.ticks;
    }

    return a.timestamp - b.timestamp;
  }
  // lose case

  return b.score - a.score;
}

export function ticksToPrettyTime(ticks: number, onlySeconds?: boolean) {
  const seconds = ticks * (TICK_DURATION / 1000);
  const hundreths = Math.round(seconds * 100);
  const minutes = Math.floor(seconds / 60);

  return (
    minutes +
    ":" +
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0") +
    (onlySeconds ? "" : "." + (hundreths % 100).toString().padStart(2, "0"))
  );
}
