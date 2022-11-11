import React, { CSSProperties } from "react";
import { EffectFunction, SkillSheet } from "./models";
import {
  GiBeamWake,
  GiBlaster,
  GiBullets,
  GiBullseye,
  GiBurningDot,
  GiHeadshot,
  GiMachineGunMagazine,
  GiOpenTreasureChest,
  GiPiercedBody,
  GiReloadGunBarrel,
  GiStrikingBalls,
  GiSupersonicBullet,
} from "react-icons/gi";
import { FaDollarSign } from "react-icons/fa";
import { Gun } from "../Weapons/Gun";

const skillIconStyle: CSSProperties = { fontSize: 30 };

export type PlayerStat =
  | "maxHealth"
  | "moveSpeed"
  | "damageMultiplier"
  | "reloadTimeMultiplier"
  | "magSizeMultiplier"
  | "critChanceMultiplier"
  | "rangeMultiplier"
  | "recoilMultiplier"
  | "fireRateMultiplier"
  | "velocityMultiplier"
  | "penetrationMultiplier"
  | "dropChanceMultiplier";

export type WeaponStat =
  | "damage"
  | "reloadTime"
  | "magSize"
  | "critChance"
  | "range"
  | "recoil"
  | "fireRate"
  | "ammoCost"
  | "velocity"
  | "penetration"
  | "projectiles";

export type SkillType =
  | "damage"
  | "reloadSpeed"
  | "magSize"
  | "critChange"
  | "range"
  | "recoil"
  | "fireRate"
  | "ammoCost"
  | "velocity"
  | "dropChange"
  | "projectiles"
  | "burn"
  | "pentration";

export interface Skill {
  type: SkillType;
  description: string;
  content: React.ReactNode;
  getEffect: EffectFunction;
}

type SkillConstructor = (getEffect: EffectFunction) => Skill;

export const DamageSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "damage",
  description: "Increase bullet damage from <before> to <after>",
  content: <GiBlaster style={skillIconStyle} />,
  getEffect,
});

export const CritChanceSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "critChange",
  content: <GiHeadshot style={skillIconStyle} />,
  description: "Increase critical hit chance from <before> to <after>",
  getEffect,
});

export const MagSizeSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "magSize",
  content: <GiMachineGunMagazine style={skillIconStyle} />,
  description: "Increase magazine size from <before> to <after>",
  getEffect,
});

export const RangeSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "range",
  content: <GiBeamWake style={skillIconStyle} />,
  description: "Increase range of projectile travel from <before> to <after>",
  getEffect,
});

export const RecoilSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "recoil",
  content: <GiBullseye style={skillIconStyle} />,
  description: "Decrease recoil from <before> to <after>",
  getEffect,
});

export const FireRateSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "fireRate",
  content: <GiBullets style={skillIconStyle} />,
  description: "Increase fire rate from <before> to <after>",
  getEffect,
});

export const AmmoCostSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "ammoCost",
  content: <FaDollarSign style={skillIconStyle} />,
  description: "Decrease cost of ammo from <before> to <after>",
  getEffect,
});

export const VelocitySkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "velocity",
  content: <GiSupersonicBullet style={skillIconStyle} />,
  description: "Increase bullet velocity from <before> to <after>",
  getEffect,
});

export const DropChanceSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "dropChange",
  content: <GiOpenTreasureChest style={skillIconStyle} />,
  description: "Increase drop chance from kills from <before> to <after>",
  getEffect,
});

export const ReloadSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "reloadSpeed",
  content: <GiReloadGunBarrel style={skillIconStyle} />,
  description: "Decrease reload speed from <before> to <after>",
  getEffect,
});

export const MultiShotSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "projectiles",
  content: <GiStrikingBalls style={skillIconStyle} />,
  description: "Shoot 3 bullets instead of 1",
  getEffect,
});

export const BurnSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "burn",
  content: <GiBurningDot style={skillIconStyle} />,
  description: "Bullets will burn enemies",
  getEffect,
});

export const PenetrationSkill: SkillConstructor = (getEffect: EffectFunction) => ({
  type: "pentration",
  content: <GiPiercedBody style={skillIconStyle} />,
  description: "Bullets will penetrate enemies with damage dropoff",
  getEffect,
});

export const PistolSkills: Skill[] = [
  MultiShotSkill((points) => points * 10),
  BurnSkill((points) => points * 10),
  PenetrationSkill((points) => points * 10),
  CritChanceSkill((points) => points * 10),
  AmmoCostSkill((points) => points * 10),
  DropChanceSkill((points) => points * 10),
  FireRateSkill((points) => -points * 3),
  RecoilSkill((points) => -points * 3),
  RangeSkill((points) => points * 10),
  DamageSkill((points) => points * 10),
  ReloadSkill((points, entity) => -points * 0.1 * (entity as Gun).getReloadTime(true)),
  MagSizeSkill((p) => p),
];

export const ShotgunSkills: Skill[] = [
  BurnSkill((points) => points * 10),
  PenetrationSkill((points) => points * 10),
  CritChanceSkill((points) => points * 10),
  AmmoCostSkill((points) => points * 10),
  DropChanceSkill((points) => points * 10),
  FireRateSkill((points) => -points * 3),
  RecoilSkill((points) => -points * 3),
  RangeSkill((points) => points * 10),
  ReloadSkill((points, entity) => -points * 0.1 * (entity as Gun).getReloadTime(true)),
  MagSizeSkill((p) => p),
  DamageSkill((points) => points * 10),
  MultiShotSkill((points) => points * 10),
];

// export const PistolNiceSkillSheet: SkillSheet = {
//   "damage": Dama {skillTreeIndex:0,
// skillTreeIndex: skillTreeIndex, get DamageSkill(p => p)}
// }

export function createSkillSheet(skills: Skill[]): SkillSheet {
  const skillSheet: SkillSheet = {};

  skills.forEach((s, i) => (skillSheet[s.type] = { ...s, points: 0, skillTreeIndex: i }));

  return skillSheet;
}
