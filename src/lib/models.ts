import { Point } from "./definitions";

export interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  fullName: string;
  nickname: string;
}

export interface Credentials extends AWS.CognitoIdentityServiceProvider.AuthenticationResultType {
  ExpirationTimestamp: number;
}

export interface LeaderboardEntry {
  player: string;
  score: number;
  ticks: number;
  lives: number;
  wave: number;
  won: boolean;
  timestamp: number;
}

export interface SNode {
  key: string;
  pos: Point;
  tilePos: Point;
}
