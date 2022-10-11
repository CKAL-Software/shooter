import { gameStats } from "../../Shooter";
import { Point } from "../../lib/definitions";
import { MovingObject } from "../MovingObject";

export abstract class Enemy extends MovingObject {
  private maxHp: number;
  private currentHp: number;
  private size: number;
  private color: string;
  private path: Point[];
  private pathIndex: number = 0;
  private damage: number;
  private reward: number;
  protected actualVelocity: number;
  protected slowCounter: number = 0;

  constructor(
    path: Point[],
    hp: number,
    size: number,
    color: string,
    velocity: number,
    damage: number,
    reward: number
  ) {
    super(path[0], velocity);
    this.actualVelocity = velocity;
    this.path = path;
    this.maxHp = hp;
    this.currentHp = hp;
    this.size = size;
    this.color = color;
    this.damage = damage;
    this.reward = reward;
  }

  move() {
    this.setPosition(this.path[Math.round(this.pathIndex)]);
    this.pathIndex = this.pathIndex + this.actualVelocity;

    if (this.pathIndex > this.path.length - 1) {
      this.pathIndex = this.pathIndex - (this.path.length - 1);
      gameStats.health = Math.max(0, gameStats.health - this.damage);
    }
  }

  tick() {
    this.move();
    if (this.slowCounter > 0) {
      this.slowCounter--;
    } else {
      this.actualVelocity = this.velocity;
    }
  }

  drawBody(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D, doubleLength?: boolean) {
    ctx.beginPath();
    ctx.rect(
      this.drawPosition.x - 15 * (doubleLength ? 2 : 1),
      this.drawPosition.y - (this.size + 10),
      30 * (doubleLength ? 2 : 1),
      6
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      this.drawPosition.x - 15 * (doubleLength ? 2 : 1),
      this.drawPosition.y - (this.size + 10),
      Math.round(30 * (doubleLength ? 2 : 1) * (this.currentHp / this.maxHp)),
      6
    );
    ctx.fillStyle = "#3cff00";
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawBody(ctx);
    this.drawHealthBar(ctx);
  }

  slow(slowAmount: number, slowDuration: number) {
    this.actualVelocity = Math.max(0.1, this.actualVelocity - slowAmount);
    this.slowCounter = slowDuration;
  }

  inflictDamage(damage: number) {
    gameStats.waveHealth -= Math.min(this.currentHp, damage);
    this.currentHp = Math.max(0, this.currentHp - damage);

    if (this.currentHp <= 0) {
      this.shouldDraw = false;

      gameStats.points += this.maxHp;
      gameStats.money += this.reward;
    }
  }

  getSize() {
    return this.size;
  }

  getCurrentHp() {
    return this.currentHp;
  }

  getPathIndex() {
    return this.pathIndex;
  }
}