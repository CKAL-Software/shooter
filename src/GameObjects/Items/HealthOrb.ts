import { Point } from "../../lib/definitions";
import { COLOR_HP_BAR_GREEN } from "../../lib/definitions.colors";
import { player } from "../../Shooter";
import { Orb } from "./Orb";

export class HealthOrb extends Orb {
  private health: number;

  constructor(position: Point, health: number) {
    super(position, 8, COLOR_HP_BAR_GREEN);

    this.health = health;
  }

  onPickup(): void {
    player.addHealth(this.health);
    player.setTint(0, 255, 0);
  }
}
