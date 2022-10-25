import { getSurroundingObstacles, pixelsToTile } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { map } from "../Shooter";
import { GameObject } from "./GameObject";

export class Player extends GameObject {
  protected drawPositionX = 500;
  protected drawPositionY = 400;
  protected moveSpeed = 2.5;
  protected size = 20;
  protected health = 100;
  protected color = "#c67c16";
  protected tile = { x: 0, y: 0 };
  protected surroundingObstacles: { topLeftPoint: Point }[] = [];

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.drawPositionX, this.drawPositionY, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  tick(): void {}

  move(direction: string) {
    let newX = this.drawPositionX;
    let newY = this.drawPositionY;

    if (direction === "w") {
      newY -= this.moveSpeed;
    } else if (direction === "a") {
      newX -= this.moveSpeed;
    } else if (direction === "s") {
      newY += this.moveSpeed;
    } else if (direction === "d") {
      newX += this.moveSpeed;
    }

    const [isColliding, forceUpOrDown] = this.checkCollision({ x: newX, y: newY });

    if (isColliding) {
      if (forceUpOrDown === undefined) {
        // we are not stuck on a corner
        return;
      }

      if (forceUpOrDown) {
        // we are stuck on a corner and will try to force up or down
        if (!this.checkCollision({ x: newX, y: newY - this.moveSpeed })[0]) {
          newY -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX, y: newY + this.moveSpeed })[0]) {
          newY += this.moveSpeed;
        } else {
          return;
        }
      } else {
        // we are stuck on a corner and will try to force sideways
        if (!this.checkCollision({ x: newX - this.moveSpeed, y: newY })[0]) {
          newX -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX + this.moveSpeed, y: newY })[0]) {
          newX += this.moveSpeed;
        } else {
          return;
        }
      }
    }

    this.drawPositionX = newX;
    this.drawPositionY = newY;

    const currentTile = pixelsToTile({ x: this.drawPositionX, y: this.drawPositionY });

    if (currentTile.x !== this.tile.x || currentTile.y !== this.tile.y) {
      this.tile = currentTile;
      this.surroundingObstacles = getSurroundingObstacles(map, { x: this.drawPositionX, y: this.drawPositionY });
    }
  }

  checkCollision(newPosition: Point): [boolean, boolean | undefined] {
    for (const { topLeftPoint } of this.surroundingObstacles) {
      const circleDistanceX = Math.abs(newPosition.x - (topLeftPoint.x + TILE_SIZE / 2));
      const circleDistanceY = Math.abs(newPosition.y - (topLeftPoint.y + TILE_SIZE / 2));

      if (circleDistanceX >= TILE_SIZE / 2 + this.size) continue;
      if (circleDistanceY >= TILE_SIZE / 2 + this.size) continue;

      if (circleDistanceX <= TILE_SIZE / 2) return [true, undefined];
      if (circleDistanceY <= TILE_SIZE / 2) return [true, undefined];

      const cornerDistance_sq =
        Math.pow(circleDistanceX - TILE_SIZE / 2, 2) + Math.pow(circleDistanceY - TILE_SIZE / 2, 2);

      if (cornerDistance_sq <= this.size * this.size) {
        return [true, circleDistanceY > circleDistanceX];
      }
    }
    return [false, undefined];
  }

  getPosition() {
    return { x: this.drawPositionX, y: this.drawPositionY };
  }

  getSize() {
    return this.size;
  }

  getHealth() {
    return this.health;
  }

  inflictDamage(damage: number) {
    this.health -= damage;
  }
}
