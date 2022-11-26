import { calculateDirection, calculateDistance, drawBall } from "../../lib/util.canvas";
import { Point } from "../../lib/definitions";
import { changeDirection } from "../../lib/functions";
import { player } from "../../Shooter";
import { MovingObject } from "../MovingObject";

export abstract class Orb extends MovingObject {
  private direction: Point;
  private hasFlownToPosition = false;

  constructor(position: Point, size: number, color: string) {
    super({ position, size, velocity: Math.random() * 1 + 1.5, color });

    this.direction = changeDirection({ x: 0, y: 1 }, Math.round(Math.random() * 360));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawBall(ctx, this.getDrawPosition(), this.size, this.color);
  }

  tick(): void {
    this.move();
    this.updateSurroundingObstacles();

    if (calculateDistance(player.getPosition(), this.position) < player.getSize() + this.size) {
      this.shouldDraw = false;
      this.onPickup();
    }
  }

  abstract onPickup(): void;

  move(): void {
    if (this.hasFlownToPosition) {
      const distanceToPlayer = calculateDistance(this.position, player.getPosition());

      if (distanceToPlayer < 60) {
        this.direction = calculateDirection(this.position, player.getPosition());
        this.velocity = Math.min(Math.pow((60 - distanceToPlayer) / 15, 2), 2);
      }
    } else {
      this.velocity -= 0.05;

      if (this.velocity <= 0) {
        this.velocity = 0;
        this.hasFlownToPosition = true;
        return;
      }
    }

    let changeX = this.direction.x * this.velocity;
    let changeY = this.direction.y * this.velocity;

    const [isColliding] = this.checkCollision({ x: this.position.x + changeX, y: this.position.y + changeY });
    if (isColliding) {
      if (!this.checkCollision({ x: this.position.x, y: this.position.y + changeY })[0]) {
        changeX = 0;
        changeY *= Math.SQRT2;
      } else {
        changeY = 0;
        changeX *= Math.SQRT2;
      }
    }

    this.shiftPosition(changeX, changeY);
  }
}
