import { Enemy } from "../Enemies/Enemy";
import { Tower } from "../Towers/Tower";
import { HeatSeekingProjectile } from "./HeatSeekingProjectile";

export class HashtagProjectile extends HeatSeekingProjectile {
  private rotation: number;

  constructor(ownerTower: Tower, velocity: number, damage: number, size: number, color: string, target: Enemy) {
    super(ownerTower, velocity, damage, size, color, target);
    this.rotation = 0;
  }

  tick() {
    super.tick();
    this.rotation = (this.rotation + 5) % 360;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.drawPosition.x, this.drawPosition.y);
    ctx.rotate(this.rotation * (Math.PI / 180));
    ctx.textAlign = "center";
    ctx.font = "bold 32px serif";
    ctx.fillStyle = this.color;

    ctx.fillText("#", 0, 4);
    ctx.restore();
  }
}
