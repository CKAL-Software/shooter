import { Gun } from "../Weapons/Gun";
import { Point } from "./definitions";
import { GunSkill, SkillType } from "./skillDefinitions";

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

export type EffectFunction = (points: number, gun: Gun) => number;
export type EffectFunction2 = (gun: Gun) => number;

export interface UpgradeSheet {
  damage: {
    damage: EffectFunction[];
    randomness: EffectFunction[];
    criticalDamage: EffectFunction[];
    penetration: EffectFunction[];
  };
  ammo: {
    magSize: EffectFunction[];
    reloadSpeed: EffectFunction[];
    fireRate: EffectFunction[];
    projectiles: EffectFunction[];
    aoeRange: EffectFunction[];
  };
  utility: {
    range: EffectFunction[];
    recoil: EffectFunction[];
    velocity: EffectFunction[];
    expMultiplier: EffectFunction[];
    slow: EffectFunction[];
    dropRate: EffectFunction[];
  };
}

export interface GunSkillExtended extends GunSkill {
  points: number;
  skillTreeIndex: number;
}

export type SkillSheet = { [skillType in SkillType]?: GunSkillExtended } & { [skillType in string]: GunSkillExtended };
