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
  description: "Increase bullet damage by <value>",
  content: <GiBlaster style={skillIconStyle} />,
  getEffect,
});

export const CritChanceSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.CritChance,
  content: <GiHeadshot style={skillIconStyle} />,
  description: "Increase critical hit chance by <value>",
  getEffect,
});

export const MagSizeSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.MagSize,
  content: <GiMachineGunMagazine style={skillIconStyle} />,
  description: "Increase magazine size by <value>",
  getEffect,
});

export const RangeSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Range,
  content: <GiBeamWake style={skillIconStyle} />,
  description: "Increase range by <value>",
  getEffect,
});

export const RecoilSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Recoil,
  content: <GiBullseye style={skillIconStyle} />,
  description: "Decrease recoil by <neg_value>",
  getEffect,
});

export const FireRateSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.FireRate,
  content: <GiBullets style={skillIconStyle} />,
  description: "Increase fire rate by <value>",
  getEffect,
});

export const AmmoCostSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.AmmoCost,
  content: <FaDollarSign style={skillIconStyle} />,
  description: "Decrease cost of ammo by <neg_value>",
  getEffect,
});

export const VelocitySkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Velocity,
  content: <GiSupersonicBullet style={skillIconStyle} />,
  description: "Increase bullet velocity by <value>",
  getEffect,
});

export const DropChanceSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.DropChance,
  content: <GiOpenTreasureChest style={skillIconStyle} />,
  description: "Increase drop chance from kills by <value>",
  getEffect,
});

export const ReloadSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.ReloadSpeed,
  content: <GiReloadGunBarrel style={skillIconStyle} />,
  description: "Decrease reload speed by <neg_value>",
  getEffect,
});

export const MultiShotSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Projectiles,
  content: <GiStrikingBalls style={skillIconStyle} />,
  description: "Increase projectiles fired by <value>",
  getEffect,
});

export const BurnSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Burn,
  content: <GiBurningDot style={skillIconStyle} />,
  description: "Bullets will burn enemies for <value> of damage",
  getEffect,
});

export const PenetrationSkill: SkillConstructor<WeaponStat> = (getEffect: EffectFunction) => ({
  stat: Stat.Penetration,
  content: <GiPiercedBody style={skillIconStyle} />,
  description: "Bullets will penetrate enemies",
  getEffect,
});

const StandardDamageSkill = DamageSkill((p) => ({ effect: p * 0.1, isAbsolute: false }));
const StandardReloadSkill = ReloadSkill((p) => ({ effect: p * -0.15, isAbsolute: false }));
const StandardRecoilSkill = RecoilSkill((p) => ({ effect: p * -0.15, isAbsolute: false }));
const StandardRangeSkill = RangeSkill((p) => ({ effect: p * 0.4, isAbsolute: false }));
const StandardFireRateSkill = FireRateSkill((p) => ({ effect: p * 0.15, isAbsolute: false }));
const StandardAmmoCostSkill = AmmoCostSkill((p) => ({ effect: p * -0.1, isAbsolute: false }));
const StandardDropChanceSkill = DropChanceSkill((p) => ({ effect: p * 0.4, isAbsolute: false }));
const StandardCritChanceSkill = CritChanceSkill((p) => ({ effect: p * 0.05, isAbsolute: true }));
const StandardPenetrationSkill = PenetrationSkill((p) => ({ effect: p, isAbsolute: true }));
const StandardBurnSkill = BurnSkill((p) => ({ effect: p * 0.7, isAbsolute: false }));

export const PistolSkills: Skill<WeaponStat>[] = [
  MultiShotSkill((p) => ({ effect: p * 2, isAbsolute: true })),
  StandardBurnSkill,
  StandardPenetrationSkill,
  StandardCritChanceSkill,
  StandardAmmoCostSkill,
  StandardDropChanceSkill,
  StandardFireRateSkill,
  StandardRecoilSkill,
  StandardRangeSkill,
  StandardDamageSkill,
  StandardReloadSkill,
  MagSizeSkill((p) => ({ effect: p * 2, isAbsolute: true })),
];

export const ShotgunSkills: Skill<WeaponStat>[] = [
  MultiShotSkill((p) => ({ effect: p * 8, isAbsolute: true })),
  StandardBurnSkill,
  StandardPenetrationSkill,
  StandardCritChanceSkill,
  StandardAmmoCostSkill,
  StandardDropChanceSkill,
  StandardFireRateSkill,
  StandardRecoilSkill,
  StandardRangeSkill,
  StandardDamageSkill,
  StandardReloadSkill,
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
