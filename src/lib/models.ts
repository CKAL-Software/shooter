import { Player } from "../GameObjects/Player";
import { Gun } from "../Weapons/Gun";
import { Point } from "./definitions";
import { Skill, SkillType } from "./skillDefinitions";

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

export type Direction = "a" | "s" | "d" | "w";

export type EffectFunction = (points: number, entity: Gun | Player) => number;

export interface SkillExtended extends Skill {
  points: number;
  skillTreeIndex: number;
}

export type SkillSheet = { [skillType in SkillType]?: SkillExtended } & { [skillType in string]: SkillExtended };
