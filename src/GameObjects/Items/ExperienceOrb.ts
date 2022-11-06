import { COLOR_EXP, Point } from "../../lib/definitions";
import { player } from "../../Shooter";
import { Orb } from "./Orb";

export class ExperienceOrb extends Orb {
  private experience: number;

  constructor(position: Point, experience: number) {
    super(position, 8, COLOR_EXP);

    this.experience = experience;
  }

  onPickup(): void {
    player.addExperience(this.experience);
    player.setTint(144, 202, 249);
  }
}
