import { calculateDistance, drawBall } from "../../lib/canvasFunctions";
import { COLOR_MONEY, Point } from "../../lib/definitions";
import { player } from "../../Shooter";
import { MovingObject } from "../MovingObject";

export class Money extends MovingObject {
  private money: number;
  private direction: Point;
  private hasFlownToPosition = false;

  constructor(money: number, position: Point, direction: Point) {
    const size = Math.min(12, Math.max(3, money));
    super({ position, size, velocity: Math.random(), color: COLOR_MONEY });

    this.money = money;
    this.direction = direction;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawBall(ctx, this.getDrawPosition(), this.size, this.color);
  }

  tick(): void {
    this.updateSurroundingObstacles();

    if (calculateDistance(player.getPosition(), this.position) < player.getSize() + this.size) {
      this.shouldDraw = false;
      player.changeMoney(this.money);
      player.setTint(237, 213, 0);
    }
  }

  move(): void {
    if (this.hasFlownToPosition) {
      return;
    }

    this.velocity -= 0.05;

    if (this.velocity <= 0) {
      this.velocity = 0;
      this.hasFlownToPosition = true;
      return;
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
