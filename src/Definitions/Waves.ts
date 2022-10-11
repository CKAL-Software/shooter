import { BasicEnemy } from "../GameObjects/Enemies/BasicEnemy";
import { FastEnemy } from "../GameObjects/Enemies/FastEnemy";
import { FlyingEnemy } from "../GameObjects/Enemies/FlyingEnemy";
import { ToughEnemy } from "../GameObjects/Enemies/ToughEnemy";
import { EnemyConstructor } from "../lib/definitions";

export interface WaveSpecification {
  amount: number;
  frequency: number;
  reward: number;
  hp: number;
  velocity: number;
  damage: number;
  enemyType: EnemyConstructor;
}

function a(hp: number, amount: number, frequency: number, reward: number, damage: number, enemyType: EnemyConstructor) {
  const velocityFixation = enemyType === ToughEnemy ? 0.5 : enemyType === FastEnemy ? 2.8 : 1;
  return {
    enemyType: enemyType,
    hp: hp,
    amount: amount,
    frequency: frequency,
    velocity: velocityFixation,
    reward: reward,
    damage: damage,
  };
}

export const waves: WaveSpecification[] = [
  a(50, 5, 0.5, 1, 5, BasicEnemy),
  a(50, 10, 0.5, 1, 5, BasicEnemy),
  a(90, 10, 0.5, 1, 5, BasicEnemy),
  a(62, 20, 2, 1, 5, BasicEnemy), // 4 Dense
  a(100, 10, 1, 1, 5, FastEnemy), // 5 Fast
  a(205, 15, 0.75, 1, 5, BasicEnemy),
  a(270, 15, 0.75, 1, 5, BasicEnemy),
  a(345, 15, 0.75, 1, 5, BasicEnemy),
  a(130, 10, 0.75, 1, 5, FlyingEnemy), // 9 Flying
  a(4200, 3, 0.1, 5, 10, ToughEnemy), // 10 Boss
  a(460, 20, 1, 1, 5, BasicEnemy),
  a(560, 20, 1, 1, 5, BasicEnemy),
  a(670, 20, 1, 1, 5, BasicEnemy),
  a(340, 40, 2.5, 1, 5, BasicEnemy), // 14 Dense
  a(430, 30, 1.25, 1, 5, FastEnemy), // 15 Fast
  a(765, 30, 1.25, 1, 5, BasicEnemy),
  a(890, 30, 1.25, 1, 5, BasicEnemy),
  a(1025, 30, 1.25, 1, 5, BasicEnemy),
  a(440, 20, 1.25, 1, 5, FlyingEnemy), // 19 Flying
  a(14800, 3, 0.1, 15, 15, ToughEnemy), // 20 Boss
  a(1100, 40, 1.5, 1, 5, BasicEnemy),
  a(1200, 40, 1.5, 1, 5, BasicEnemy),
  a(1300, 40, 1.5, 1, 5, BasicEnemy),
  a(710, 80, 4, 1, 5, BasicEnemy), // 24 Dense
  a(850, 40, 2, 1, 5, FastEnemy), // 25 Fast
  a(1400, 60, 2, 1, 5, BasicEnemy),
  a(1550, 60, 2, 1, 5, BasicEnemy),
  a(1670, 60, 2, 1, 5, BasicEnemy),
  a(1300, 60, 2, 1, 5, FlyingEnemy), // 29 FLying
  a(20000, 5, 0.1, 50, 20, ToughEnemy), // 30 Boss
];
