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

export enum Stat {
  Damage = "damage",
  ReloadSpeed = "reloadSpeed",
  MagSize = "magSize",
  CritChance = "critChance",
  Range = "range",
  Recoil = "recoil",
  FireRate = "fireRate",
  AmmoCost = "ammoCost",
  Velocity = "velocity",
  Penetration = "penetration",
  Projectiles = "projectiles",
  DropChance = "dropChance",
  Burn = "burn",
  MaxHealth = "maxHealth",
  MoveSpeed = "moveSpeed",
}

export type WeaponStats = { [stat in WeaponStat]: number };
export type PlayerStats = { [stat in PlayerStat]: number };

export type WeaponStat =
  | Stat.Damage
  | Stat.ReloadSpeed
  | Stat.MagSize
  | Stat.CritChance
  | Stat.Range
  | Stat.Recoil
  | Stat.FireRate
  | Stat.AmmoCost
  | Stat.Velocity
  | Stat.Penetration
  | Stat.Projectiles
  | Stat.DropChance
  | Stat.Burn;

export type PlayerStat =
  | Stat.MaxHealth
  | Stat.MoveSpeed
  | Stat.Damage
  | Stat.ReloadSpeed
  | Stat.CritChance
  | Stat.Range
  | Stat.Recoil
  | Stat.FireRate
  | Stat.AmmoCost
  | Stat.Velocity
  | Stat.Penetration
  | Stat.DropChance
  | Stat.Burn;

export interface Skill<Stat> {
  stat: Stat;
  description: string;
  content: React.ReactNode;
  getEffect: EffectFunction;
}

type SkillConstructor<T> = (getEffect: EffectFunction) => Skill<T>;

export const DamageSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Damage,
  description: "Increase bullet damage from <before> to <after>",
  content: <GiBlaster style={skillIconStyle} />,
  getEffect,
});

export const CritChanceSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.CritChance,
  content: <GiHeadshot style={skillIconStyle} />,
  description: "Increase critical hit chance from <before> to <after>",
  getEffect,
});

export const MagSizeSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.MagSize,
  content: <GiMachineGunMagazine style={skillIconStyle} />,
  description: "Increase magazine size from <before> to <after>",
  getEffect,
});

export const RangeSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Range,
  content: <GiBeamWake style={skillIconStyle} />,
  description: "Increase range of projectile travel from <before> to <after>",
  getEffect,
});

export const RecoilSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Recoil,
  content: <GiBullseye style={skillIconStyle} />,
  description: "Decrease recoil from <before> to <after>",
  getEffect,
});

export const FireRateSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.FireRate,
  content: <GiBullets style={skillIconStyle} />,
  description: "Increase fire rate from <before> to <after>",
  getEffect,
});

export const AmmoCostSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.AmmoCost,
  content: <FaDollarSign style={skillIconStyle} />,
  description: "Decrease cost of ammo from <before> to <after>",
  getEffect,
});

export const VelocitySkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Velocity,
  content: <GiSupersonicBullet style={skillIconStyle} />,
  description: "Increase bullet velocity from <before> to <after>",
  getEffect,
});

export const DropChanceSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.DropChance,
  content: <GiOpenTreasureChest style={skillIconStyle} />,
  description: "Increase drop chance from kills from <before> to <after>",
  getEffect,
});

export const ReloadSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.ReloadSpeed,
  content: <GiReloadGunBarrel style={skillIconStyle} />,
  description: "Decrease reload speed from <before> to <after>",
  getEffect,
});

export const MultiShotSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Projectiles,
  content: <GiStrikingBalls style={skillIconStyle} />,
  description: "Shoot 3 bullets instead of 1",
  getEffect,
});

export const BurnSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Burn,
  content: <GiBurningDot style={skillIconStyle} />,
  description: "Bullets will burn enemies",
  getEffect,
});

export const PenetrationSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Penetration,
  content: <GiPiercedBody style={skillIconStyle} />,
  description: "Bullets will penetrate enemies with damage dropoff",
  getEffect,
});

export const PistolSkills: Skill<WeaponStat>[] = [
  MultiShotSkill((points) => ({ effect: points * 1, isAbsolute: true })),
  BurnSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  PenetrationSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  CritChanceSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  AmmoCostSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  DropChanceSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  FireRateSkill((points) => ({ effect: -points * 3, isAbsolute: true })),
  RecoilSkill((points) => ({ effect: -points * 3, isAbsolute: true })),
  RangeSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  DamageSkill((points) => ({ effect: points * 0.1, isAbsolute: false })),
  ReloadSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  MagSizeSkill((p) => ({ effect: p, isAbsolute: true })),
];

export const ShotgunSkills: Skill<WeaponStat>[] = [
  MultiShotSkill((points) => ({ effect: points * 1, isAbsolute: true })),
  BurnSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  PenetrationSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  CritChanceSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  AmmoCostSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  DropChanceSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  FireRateSkill((points) => ({ effect: -points * 3, isAbsolute: true })),
  RecoilSkill((points) => ({ effect: -points * 3, isAbsolute: true })),
  RangeSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  DamageSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  ReloadSkill((points) => ({ effect: points * 10, isAbsolute: true })),
  MagSizeSkill((p) => ({ effect: p, isAbsolute: true })),
];

// export const PistolNiceSkillSheet: SkillSheet = {
//   "damage": Dama {skillTreeIndex:0,
// skillTreeIndex: skillTreeIndex, get DamageSkill(p => p)}
// }

export function createSkillSheet<T extends Stat>(skills: Skill<T>[]): SkillSheet<T> {
  const skillSheet: SkillSheet<T> = {};

  skills.forEach((s, i) => (skillSheet[s.stat] = { ...s, points: 0, skillTreeIndex: i }));

  return skillSheet;
}
