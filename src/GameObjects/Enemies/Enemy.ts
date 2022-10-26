import { gameStats, map, numberAnimations, player } from "../../Shooter";
import { Point } from "../../lib/definitions";
import { MovingObject } from "../MovingObject";
import { calculateDirection, calculateDistance, pathToPoint } from "../../lib/canvasFunctions";
import { NumberAnimation } from "../NumberAnimation";
import { SNode } from "../../lib/models";

export abstract class Enemy extends MovingObject {
  private maxHp: number;
  private currentHp: number;
  private color: string;
  private pathIndex = 0;
  private damage: number;
  private reward: number;
  private path: SNode[] = [];
  private ticksUntilPathRecalculated = 0;
  protected actualVelocity: number;
  protected slowCounter = 0;

  constructor(
    startPosition: Point,
    hp: number,
    size: number,
    color: string,
    velocity: number,
    damage: number,
    reward: number
  ) {
    super(startPosition, velocity, size);
    this.actualVelocity = velocity;
    this.maxHp = hp;
    this.currentHp = hp;
    this.size = size;
    this.color = color;
    this.damage = damage;
    this.reward = reward;
  }

  move() {
    // const direction = calculateDirection(this.position, player.getPosition());
    // const changeX = direction.x * this.velocity;
    // const changeY = direction.y * this.velocity;

    // this.shiftPosition(changeX, changeY);

    if (this.path.length === 0) {
      return;
    }

    const direction = calculateDirection(this.position, this.path[0].pos);
    let changeX = direction.x * this.velocity;
    let changeY = direction.y * this.velocity;

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

  tick() {
    this.move();
    this.ticksUntilPathRecalculated--;

    if (this.ticksUntilPathRecalculated <= 0) {
      this.ticksUntilPathRecalculated = 100;
      this.path = pathToPoint(map, this.position, player.getPosition()).slice(1);
    }

    if (this.slowCounter > 0) {
      this.slowCounter--;
    } else {
      this.actualVelocity = this.velocity;
    }

    if (this.path.length > 0 && calculateDistance(this.position, this.path[0].pos) <= 1) {
      this.path = this.path.slice(1);
    }

    this.updateSurroundingObstacles();
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

    this.path.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.pos.x, node.pos.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    });
  }

  slow(slowAmount: number, slowDuration: number) {
    this.actualVelocity = Math.max(0.1, this.actualVelocity - slowAmount);
    this.slowCounter = slowDuration;
  }

  inflictDamage(damage: number) {
    gameStats.waveHealth -= Math.min(this.currentHp, damage);
    this.currentHp = Math.max(0, this.currentHp - damage);

    numberAnimations.push(
      new NumberAnimation({ x: this.position.x - this.size, y: this.position.y - this.size }, damage)
    );

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
