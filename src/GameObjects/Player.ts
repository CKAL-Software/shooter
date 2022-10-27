import { calculateDirection } from "../lib/canvasFunctions";
import { Point } from "../lib/definitions";
import { projectiles } from "../Shooter";
import { Gun } from "../Weapons/Gun";
import { Pistol } from "../Weapons/Pistol";
import { GameObject } from "./GameObject";
import { NormalProjectile } from "./Projectiles/NormalProjectile";

export class Player extends GameObject {
  private moveSpeed = 2.5;
  private health = 100;
  private color = "#c67c16";
  private velocity = { x: 0, y: 0 };
  private currentWeapon = new Pistol(6, 1.2, 3, 4, "black", 100);

  constructor() {
    super(15, { x: 200, y: 280 });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  tick(): void {}

  move(direction: string) {
    let newX = this.drawPosition.x;
    let newY = this.drawPosition.y;

    if (direction === "w") {
      newY -= this.moveSpeed;
    } else if (direction === "a") {
      newX -= this.moveSpeed;
    } else if (direction === "s") {
      newY += this.moveSpeed;
    } else if (direction === "d") {
      newX += this.moveSpeed;
    }

    const [isColliding, mayForce] = this.checkCollision({ x: newX, y: newY });

    if (isColliding) {
      if (!mayForce) {
        // we are not stuck on a corner
        return;
      }

      if (direction === "a" || direction === "d") {
        if (!this.checkCollision({ x: newX, y: newY - this.moveSpeed })[0]) {
          newY -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX, y: newY + this.moveSpeed })[0]) {
          newY += this.moveSpeed;
        } else {
          return;
        }
      }

      if (direction === "w" || direction === "s") {
        if (!this.checkCollision({ x: newX - this.moveSpeed, y: newY })[0]) {
          newX -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX + this.moveSpeed, y: newY })[0]) {
          newX += this.moveSpeed;
        } else {
          return;
        }
      }
    }

    this.velocity = { x: newX - this.drawPosition.x, y: newY - this.drawPosition.y };

    this.drawPosition.x = newX;
    this.drawPosition.y = newY;

    this.updateSurroundingObstacles();
  }

  shoot(target: Point) {
    const direction = calculateDirection(this.getPosition(), { x: target.x, y: target.y });

    const ang = (Math.random() * 30 - 15) * (Math.PI / 180);

    const angledDirection = {
      x: direction.x * Math.cos(ang) - direction.y * Math.sin(ang),
      y: direction.x * Math.sin(ang) + direction.y * Math.cos(ang),
    };

    this.currentWeapon.fire(angledDirection);
    // projectiles.push(new NormalProjectile(this.getPosition(), 3, 10, 4, "black", angledDirection, true));
  }

  getVelocity() {
    return this.velocity;
  }

  getPosition() {
    return { x: this.drawPosition.x, y: this.drawPosition.y };
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
