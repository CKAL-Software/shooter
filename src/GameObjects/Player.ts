import { GameObject } from "./GameObject";

export class Player extends GameObject {
  protected drawPositionX = 50;
  protected drawPositionY = 50;
  protected moveSpeed = 2.5;

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.drawPositionX, this.drawPositionY, 30, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  tick(): void {}

  move(direction: string) {
    if (direction === "w") {
      this.drawPositionY -= this.moveSpeed;
    } else if (direction === "a") {
      this.drawPositionX -= this.moveSpeed;
    } else if (direction === "s") {
      this.drawPositionY += this.moveSpeed;
    } else if (direction === "d") {
      this.drawPositionX += this.moveSpeed;
    }
  }

  getPosition() {
    return { x: this.drawPositionX, y: this.drawPositionY };
  }
}
