import React, { CSSProperties } from "react";
import { EffectFunction } from "./models";
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
  GiStrikingArrows,
  GiSupersonicBullet,
} from "react-icons/gi";
import { FaDollarSign } from "react-icons/fa";

const skillIconStyle: CSSProperties = { fontSize: 30 };

export interface GunSkill {
  description: string;
  content: React.ReactNode;
  getEffect: EffectFunction;
}

export const DamageSkill = (getEffect: EffectFunction) => ({
  description: "Increase bullet damage",
  content: <GiBlaster style={skillIconStyle} />,
  getEffect,
});

export const CritChanceSkill = (getEffect: EffectFunction) => ({
  content: <GiHeadshot style={skillIconStyle} />,
  description: "Increase critical hit chance",
  getEffect,
});

export const MagSizeSkill = (getEffect: EffectFunction) => ({
  content: <GiMachineGunMagazine style={skillIconStyle} />,
  description: "Increase magazine size from <before> to <after>",
  getEffect,
});

export const RangeSkill = (getEffect: EffectFunction) => ({
  content: <GiBeamWake style={skillIconStyle} />,
  description: "Increase range of projectile travel",
  getEffect,
});

export const RecoilSkill = (getEffect: EffectFunction) => ({
  content: <GiBullseye style={skillIconStyle} />,
  description: "Decrease recoil",
  getEffect,
});

export const FireRateSkill = (getEffect: EffectFunction) => ({
  content: <GiBullets style={skillIconStyle} />,
  description: "Increase fire rate",
  getEffect,
});

export const AmmoCostSkill = (getEffect: EffectFunction) => ({
  content: <FaDollarSign style={skillIconStyle} />,
  description: "Decrease cost of ammo",
  getEffect,
});

export const VelocitySkill = (getEffect: EffectFunction) => ({
  content: <GiSupersonicBullet style={skillIconStyle} />,
  description: "Increase bullet velocity",
  getEffect,
});

export const DropChangeSkill = (getEffect: EffectFunction) => ({
  content: <GiOpenTreasureChest style={skillIconStyle} />,
  description: "Increase drop chance from kills",
  getEffect,
});

export const ReloadSkill = (getEffect: EffectFunction) => ({
  content: <GiReloadGunBarrel style={skillIconStyle} />,
  description: "Decrease reload speed",
  getEffect,
});

export const MultiShotSkill = (getEffect: EffectFunction) => ({
  content: <GiStrikingArrows style={skillIconStyle} />,
  description: "Shoot 3 bullets instead of 1",
  getEffect,
});

export const BurnSkill = (getEffect: EffectFunction) => ({
  content: <GiBurningDot style={skillIconStyle} />,
  description: "Bullets will burn enemies",
  getEffect,
});

export const PenetrationSkill = (getEffect: EffectFunction) => ({
  content: <GiPiercedBody style={skillIconStyle} />,
  description: "Bullets will penetrate enemies with damage dropoff",
  getEffect,
});

export const PistolSkillSheet: GunSkill[] = [
  MagSizeSkill((gun, points) => {
    const bonusAmmo = [0, 1, 2, 3][points];

    return gun.getMagazineSize() + bonusAmmo;
  }),
  ReloadSkill((_, points) => points * 10),
  DamageSkill((_, points) => points),
  RangeSkill((_, points) => points * 10),
  RecoilSkill((_, points) => -points * 3),
  FireRateSkill((_, points) => -points * 3),
  DropChangeSkill((_, points) => points * 10),
  AmmoCostSkill((_, points) => points * 10),
  CritChanceSkill((_, points) => points * 10),
  MultiShotSkill((_, points) => points * 10),
  BurnSkill((_, points) => points * 10),
  PenetrationSkill((_, points) => points * 10),
];
