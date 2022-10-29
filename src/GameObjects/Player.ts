import { experienceThresholdsPlayer } from "../lib/definitions";
import { toUnitVector } from "../lib/functions";
import { Direction } from "../lib/models";
import { mousePos } from "../Shooter";
import { Pistol } from "../Weapons/Pistol";
import { MovingObject } from "./MovingObject";

export class Player extends MovingObject {
  private health = 100;
  private currentWeapon = new Pistol();
  private moveDirections: Set<Direction> = new Set();
  private wantFire = false;
  private level = 1;
  private experience = 0;

  constructor() {
    super({ position: { x: 200, y: 280 }, size: 15, velocity: 2.5, color: "#c67c16" });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const drawPos = this.getDrawPosition();

    ctx.beginPath();
    ctx.arc(drawPos.x, drawPos.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  tick() {
    this.currentWeapon.tick();
    this.move();
    if (this.wantFire) {
      this.shoot();
    }
  }

  private move() {
    this.moveDirections.forEach((dir) => this.moveDirection(dir));
  }

  private moveDirection(direction: Direction) {
    let newX = this.position.x;
    let newY = this.position.y;

    if (direction === "w") {
      newY -= this.velocity;
    } else if (direction === "a") {
      newX -= this.velocity;
    } else if (direction === "s") {
      newY += this.velocity;
    } else if (direction === "d") {
      newX += this.velocity;
    }

    const [isColliding, mayForce] = this.checkCollision({ x: newX, y: newY });

    if (isColliding) {
      if (!mayForce) {
        // we are not stuck on a corner
        return;
      }

      if (direction === "a" || direction === "d") {
        if (!this.checkCollision({ x: newX, y: newY - this.velocity })[0]) {
          newY -= this.velocity;
        } else if (!this.checkCollision({ x: newX, y: newY + this.velocity })[0]) {
          newY += this.velocity;
        } else {
          return;
        }
      }

      if (direction === "w" || direction === "s") {
        if (!this.checkCollision({ x: newX - this.velocity, y: newY })[0]) {
          newX -= this.velocity;
        } else if (!this.checkCollision({ x: newX + this.velocity, y: newY })[0]) {
          newX += this.velocity;
        } else {
          return;
        }
      }
    }

    this.setPosition({ x: newX, y: newY });

    this.updateSurroundingObstacles();
  }

  setMoveDirections(moveDirections: Set<Direction>) {
    this.moveDirections = moveDirections;
  }

  setWantFire(wantFire: boolean) {
    this.wantFire = wantFire;
  }

  private shoot() {
    this.currentWeapon.fire(mousePos);
  }

  addExperience(experience: number) {
    this.experience += experience;

    while (this.experience >= experienceThresholdsPlayer[this.level - 1]) {
      this.experience -= experienceThresholdsPlayer[this.level - 1];
      this.level++;
    }
  }

  getExperience() {
    return this.experience;
  }

  getLevel() {
    return this.level;
  }

  getCurrentWeapon() {
    return this.currentWeapon;
  }

  getVelocity() {
    return this.velocity;
  }

  getDirection() {
    const direction = { x: 0, y: 0 };

    this.moveDirections.forEach((dir) => {
      if (dir === "a") {
        direction.x--;
      } else if (dir === "d") {
        direction.x++;
      } else if (dir === "s") {
        direction.y++;
      } else {
        direction.y--;
      }
    });

    return toUnitVector(direction);
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
