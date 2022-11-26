import { Point } from "../../lib/definitions";
import { COLOR_EXP, COLOR_EXP_RGBA } from "../../lib/definitions.colors";
import { player } from "../../Shooter";
import { Orb } from "./Orb";

export class ExperienceOrb extends Orb {
  private experience: number;
  private opacity: number = 0.5;
  private increaseOpacity = true;

  constructor(position: Point, experience: number) {
    super(position, 8, COLOR_EXP);

    this.experience = experience;
  }

  tick(): void {
    super.tick();

    if (this.opacity > 1) {
      this.increaseOpacity = false;
    } else if (this.opacity < 0.4) {
      this.increaseOpacity = true;
    }

    this.opacity = this.opacity + (this.increaseOpacity ? 0.01 : -0.01);

    this.color = COLOR_EXP_RGBA(this.opacity);
  }

  onPickup(): void {
    player.addExperience(this.experience);
    player.setTint(144, 202, 249);
  }
}
