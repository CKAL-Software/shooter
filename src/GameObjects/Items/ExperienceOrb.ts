import { calculateDirection, calculateDistance, drawBall } from "../../lib/canvasFunctions";
import { COLOR_EXP, Point } from "../../lib/definitions";
import { player } from "../../Shooter";
import { MovingObject } from "../MovingObject";

export class ExperienceOrb extends MovingObject {
  private experience: number;
  private direction: Point;
  private hasFlownToPosition = false;

  constructor(experience: number, position: Point, direction: Point) {
    const size = Math.min(12, Math.max(3, experience));
    super({ position, size, velocity: Math.random() * 1 + 1.5, color: COLOR_EXP });

    this.experience = experience;
    this.direction = direction;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawBall(ctx, this.getDrawPosition(), this.size, this.color);
  }

  tick(): void {
    this.move();
    this.updateSurroundingObstacles();

    if (calculateDistance(player.getPosition(), this.position) < player.getSize() + this.size) {
      this.shouldDraw = false;
      player.addExperience(this.experience);
      player.setTint(144, 202, 249);
    }
  }

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
