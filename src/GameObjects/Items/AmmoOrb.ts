import { drawSquare } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { player } from "../../Shooter";
import { Orb } from "./Orb";

export class AmmoOrb extends Orb {
  private ammo: number;
  private weapon: string;

  constructor(position: Point, ammo: number, weapon: string) {
    super(position, 8, "lightgreen");

    this.ammo = ammo;
    this.weapon = weapon;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawSquare(ctx, this.size, this.position.x, this.position.y, this.color);
  }

  onPickup(): void {
    player.addAmmo(this.ammo, this.weapon);
    player.setTint(0, 255, 50);
  }
}
