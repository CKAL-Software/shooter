import React from "react";
import { ProjectileContructor, TowerConstructor } from "../lib/definitions";
import { BasicTower } from "../GameObjects/Towers/BasicTowers";
import { SniperTower } from "../GameObjects/Towers/ScoutTower";
import { MachineGunTower } from "../GameObjects/Towers/MachineGunTower";
import { HashtagTower } from "../GameObjects/Towers/HashtagTower";
import { HeatSeekingProjectile } from "../GameObjects/Projectiles/HeatSeekingProjectile";
import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { BoatTower } from "../GameObjects/Towers/BoatTower";
import { HashtagProjectile } from "../GameObjects/Projectiles/HashtagProjectile";
import { SlowingProjectile } from "../GameObjects/Projectiles/SlowingProjectile";
import { FreezerTower } from "../GameObjects/Towers/FreezerTower";
import { PiercingProjectile } from "../GameObjects/Projectiles/PiercingProjectile";

function getTowerHtml(color: string, border?: boolean) {
  return (
    <div
      style={{
        height: border ? "30px" : "32px",
        width: border ? "30px" : "32px",
        background: color,
        border: border ? "1px solid gray" : undefined,
      }}
    />
  );
}

export interface TowerSpecification {
  name: string;
  color: string;
  prices: number[];
  ranges: number[];
  roundsPerMins: number[];
  projectileSpec: ProjectileSpecification;
  htmlRender(color: string): React.ReactNode;
  towerConstructor: TowerConstructor;
}

export interface ProjectileSpecification {
  velocities: number[];
  damages: number[];
  slows?: number[];
  size: number;
  color: string;
  projectileConstructor: ProjectileContructor;
}

export const BasicTowerSpec: TowerSpecification = {
  name: "Basic",
  color: "#8af1e4",
  prices: [5, 5, 5, 5, 100],
  roundsPerMins: [60, 70, 90, 120, 360],
  ranges: [2, 2.5, 3, 3, 3],
  projectileSpec: {
    velocities: [3, 3, 3, 3, 4],
    damages: [10, 20, 27, 34, 150],
    size: 6,
    color: "blue",
    projectileConstructor: HeatSeekingProjectile,
  },
  htmlRender: getTowerHtml,
  towerConstructor: BasicTower,
};

export const SniperTowerSpec: TowerSpecification = {
  name: "Sniper",
  color: "orange",
  prices: [5, 10, 20, 30, 40],
  roundsPerMins: [30, 30, 30, 30, 30],
  ranges: [8, 8.5, 9, 9.5, 10],
  projectileSpec: {
    velocities: [6, 7, 8, 9, 10],
    damages: [15, 35, 70, 120, 200],
    size: 4,
    color: "darkgreen",
    projectileConstructor: PiercingProjectile,
  },
  htmlRender: getTowerHtml,
  towerConstructor: SniperTower,
};

export const MachineGunTowerSpec: TowerSpecification = {
  name: "Machine Gun",
  color: "gray",
  prices: [10, 10, 10, 20, 100],
  roundsPerMins: [200, 250, 300, 600, 800],
  ranges: [2, 2.5, 3, 3, 4],
  projectileSpec: {
    velocities: [3, 3, 3, 3.5, 4],
    damages: [10, 20, 30, 30, 100],
    size: 4,
    color: "black",
    projectileConstructor: NormalProjectile,
  },
  htmlRender: getTowerHtml,
  towerConstructor: MachineGunTower,
};

export const HashtagTowerSpec: TowerSpecification = {
  name: "Hashtag #",
  color: "#38bdf8",
  prices: [15, 20, 25, 35, 60],
  roundsPerMins: [40, 50, 60, 70, 80],
  ranges: [3, 4, 5, 6, 7],
  projectileSpec: {
    velocities: [3, 3.5, 4, 4.5, 5],
    damages: [55, 120, 200, 320, 500],
    size: 10,
    color: "#38bdf8",
    projectileConstructor: HashtagProjectile,
  },
  htmlRender: getTowerHtml,
  towerConstructor: HashtagTower,
};

export const BoatTowerSpec: TowerSpecification = {
  name: "Boat",
  color: "Brown",
  prices: [30, 30, 30, 30, 30],
  roundsPerMins: [90, 120, 140, 160, 180],
  ranges: [3, 3.5, 4, 4.5, 5],
  projectileSpec: {
    velocities: [2, 2.5, 3, 3.5, 4],
    damages: [50, 100, 150, 200, 300],
    size: 6,
    color: "lightgray",
    projectileConstructor: NormalProjectile,
  },
  htmlRender: getTowerHtml,
  towerConstructor: BoatTower,
};

export const FreezerTowerSpec: TowerSpecification = {
  name: "Freezer",
  color: "white",
  prices: [15, 15, 15, 15, 15],
  roundsPerMins: [50, 50, 50, 50, 50],
  ranges: [1, 1.5, 2, 2.5, 3],
  projectileSpec: {
    velocities: [2, 2, 2, 2, 2],
    damages: [40, 40, 40, 40, 40],
    slows: [0.2, 0.2, 0.2, 0.2, 0.2],
    size: 10,
    color: "#dddddd",
    projectileConstructor: SlowingProjectile,
  },
  htmlRender: (color) => getTowerHtml(color, true),
  towerConstructor: FreezerTower,
};

export const towerSpecifications: TowerSpecification[] = [
  BasicTowerSpec,
  SniperTowerSpec,
  MachineGunTowerSpec,
  BoatTowerSpec,
  HashtagTowerSpec,
  FreezerTowerSpec,
].sort((a, b) => a.prices[0] - b.prices[0]);
