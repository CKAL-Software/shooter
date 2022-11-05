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

const skillIconStyle: CSSProperties = { fontSize: 30 };

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
  | "multiShot"
  | "burn"
  | "pentration";

export interface GunSkill {
  type: SkillType;
  description: string;
  content: React.ReactNode;
  getEffect: EffectFunction;
}

type GunSkillConstructor = (getEffect: EffectFunction) => GunSkill;

export const DamageSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "damage",
  description: "Increase bullet damage",
  content: <GiBlaster style={skillIconStyle} />,

  getEffect,
});

export const CritChanceSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "critChange",
  content: <GiHeadshot style={skillIconStyle} />,
  description: "Increase critical hit chance",

  getEffect,
});

export const MagSizeSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "magSize",
  content: <GiMachineGunMagazine style={skillIconStyle} />,
  description: "Increase magazine size from <before> to <after>",

  getEffect,
});

export const RangeSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "range",
  content: <GiBeamWake style={skillIconStyle} />,
  description: "Increase range of projectile travel",

  getEffect,
});

export const RecoilSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "recoil",
  content: <GiBullseye style={skillIconStyle} />,
  description: "Decrease recoil",

  getEffect,
});

export const FireRateSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "fireRate",
  content: <GiBullets style={skillIconStyle} />,
  description: "Increase fire rate",

  getEffect,
});

export const AmmoCostSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "ammoCost",
  content: <FaDollarSign style={skillIconStyle} />,
  description: "Decrease cost of ammo",

  getEffect,
});

export const VelocitySkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "velocity",
  content: <GiSupersonicBullet style={skillIconStyle} />,
  description: "Increase bullet velocity",

  getEffect,
});

export const DropChangeSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "dropChange",
  content: <GiOpenTreasureChest style={skillIconStyle} />,
  description: "Increase drop chance from kills",

  getEffect,
});

export const ReloadSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "reloadSpeed",
  content: <GiReloadGunBarrel style={skillIconStyle} />,
  description: "Decrease reload speed",

  getEffect,
});

export const MultiShotSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "multiShot",
  content: <GiStrikingBalls style={skillIconStyle} />,
  description: "Shoot 3 bullets instead of 1",

  getEffect,
});

export const BurnSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "burn",
  content: <GiBurningDot style={skillIconStyle} />,
  description: "Bullets will burn enemies",

  getEffect,
});

export const PenetrationSkill: GunSkillConstructor = (getEffect: EffectFunction) => ({
  type: "pentration",
  content: <GiPiercedBody style={skillIconStyle} />,
  description: "Bullets will penetrate enemies with damage dropoff",

  getEffect,
});

export const PistolSkills: GunSkill[] = [
  MultiShotSkill((points) => points * 10),
  BurnSkill((points) => points * 10),
  PenetrationSkill((points) => points * 10),
  CritChanceSkill((points) => points * 10),
  AmmoCostSkill((points) => points * 10),
  DropChangeSkill((points) => points * 10),
  FireRateSkill((points) => -points * 3),
  RecoilSkill((points) => -points * 3),
  RangeSkill((points) => points * 10),
  DamageSkill((points) => points * 10),
  ReloadSkill((points, gun) => -points * 0.1 * gun.getReloadTime(true)),
  MagSizeSkill((p) => p),
];

export const ShotgunSkills: GunSkill[] = [
  BurnSkill((points) => points * 10),
  PenetrationSkill((points) => points * 10),
  CritChanceSkill((points) => points * 10),
  AmmoCostSkill((points) => points * 10),
  DropChangeSkill((points) => points * 10),
  FireRateSkill((points) => -points * 3),
  RecoilSkill((points) => -points * 3),
  RangeSkill((points) => points * 10),
  ReloadSkill((points, gun) => -points * 0.1 * gun.getReloadTime(true)),
  MagSizeSkill((p) => p),
  DamageSkill((points) => points * 10),
  MultiShotSkill((points) => points * 10),
];

// export const PistolNiceSkillSheet: SkillSheet = {
//   "damage": Dama {skillTreeIndex:0,
// skillTreeIndex: skillTreeIndex, get DamageSkill(p => p)}
// }

export function createSkillSheet(skills: GunSkill[]): SkillSheet {
  const skillSheet: SkillSheet = {};

  skills.forEach((s, i) => (skillSheet[s.type] = { ...s, points: 0, skillTreeIndex: i }));

  return skillSheet;
}
