import { enemies, currentMap, miscellaneous, numberAnimations, player, projectiles } from "../../Shooter";
import { COLOR_HP_BAR_GREEN, COLOR_HP_BAR_RED, TICK_DURATION_S } from "../../lib/definitions";
import { MovingObject, MovingObjectConfig } from "../MovingObject";
import { calculateDirection, calculateDistance, drawBall, getObstacles, pathToPoint } from "../../lib/canvasFunctions";
import { RisingText } from "../RisingText";
import { SNode } from "../../lib/models";
import { changeDirection, intercept, intersects, toUnitVector } from "../../lib/functions";
import { NormalProjectile } from "../Projectiles/NormalProjectile";
import { ExperienceOrb } from "../Items/ExperienceOrb";
import { Money } from "../Items/Money";

export interface EnemyConfig extends MovingObjectConfig {
  hp: number;
  damage: number;
  reward: number;
}

export abstract class Enemy extends MovingObject {
  private pathIndex = 0;
  private maxHp: number;
  private currentHp: number;
  private damage: number;
  private reward: number;
  private path: SNode[] = [];
  private ticksUntilPathRecalculated = 0;
  private timeUntilShot = this.getTimeUntilNextShot();
  private canSeePlayer = false;
  private spawnTimeLeft = 4;

  constructor(config: EnemyConfig) {
    super(config);

    this.maxHp = config.hp;
    this.currentHp = config.hp;
    this.color = config.color;
    this.damage = config.damage;
    this.reward = config.reward;
  }

  move() {
    if (this.spawnTimeLeft > 0) {
      return;
    }

    const distanceToPlayer = calculateDistance(this.position, player.getPosition());
    if (
      enemies.find(
        (e) =>
          e.spawnTimeLeft <= 0 &&
          calculateDistance(e.position, this.position) < e.size + this.size &&
          calculateDistance(e.position, player.getPosition()) < distanceToPlayer
      )
    ) {
      return;
    }

    let changeX = 0;
    let changeY = 0;

    if (this.canSeePlayer && calculateDistance(this.position, player.getPosition()) > player.getSize() + this.size) {
      const direction = calculateDirection(this.position, player.getPosition());
      changeX = direction.x * this.velocity;
      changeY = direction.y * this.velocity;
      // this.shiftPosition(changeX, changeY);
      // return;
    } else {
      if (this.path.length === 0) {
        return;
      }

      const direction = calculateDirection(this.position, this.path[0].pos);
      changeX = direction.x * this.velocity;
      changeY = direction.y * this.velocity;
    }

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

    const unit = toUnitVector({ x: changeX, y: changeY });

    this.shiftPosition(unit.x * this.velocity, unit.y * this.velocity);
  }

  tick() {
    if (this.spawnTimeLeft > 0) {
      this.spawnTimeLeft -= TICK_DURATION_S;
      return;
    }

    this.updateCanSeePlayer();
    this.updateSurroundingObstacles();
    this.updatePath();

    if (this.canSeePlayer) {
      this.timeUntilShot -= TICK_DURATION_S;

      if (this.timeUntilShot <= 0) {
        this.timeUntilShot = this.getTimeUntilNextShot();

        const playerPos = player.getPosition();
        const playerVel = player.getVelocity();

        const leadShotDirection = intercept(
          this.position,
          {
            x: playerPos.x,
            y: playerPos.y,
            vx: playerPos.x * playerVel,
            vy: playerPos.y * playerVel,
          },
          1.5
        );

        projectiles.push(
          new NormalProjectile({
            position: this.position,
            direction: calculateDirection(this.position, leadShotDirection || player.getPosition()),
            velocity: 1.5,
            damage: 5,
            size: 5,
            range: 10,
            color: "red",
            shotByPlayer: false,
          })
        );
      }
    }

    this.move();
  }

  private getTimeUntilNextShot() {
    return Math.random() * 2 + 1;
  }

  updatePath() {
    this.ticksUntilPathRecalculated--;

    if (this.ticksUntilPathRecalculated <= 0) {
      this.ticksUntilPathRecalculated = 100;
      this.path = pathToPoint(currentMap.layout, this.position, player.getPosition()).slice(1);
    }

    if (this.path.length > 0 && calculateDistance(this.position, this.path[0].pos) <= 1) {
      this.path = this.path.slice(1);
    }
  }

  drawHealthBar(ctx: CanvasRenderingContext2D, doubleLength?: boolean) {
    const width = 40;
    const height = 8;

    const drawPos = this.getDrawPosition();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      width * (doubleLength ? 2 : 1),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_RED;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      Math.round(width * (doubleLength ? 2 : 1) * (this.currentHp / this.maxHp)),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_GREEN;
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawPos = this.getDrawPosition();

    if (this.spawnTimeLeft > 0) {
      drawBall(ctx, drawPos, this.size * (1 - this.spawnTimeLeft / 4), this.color);
      return;
    }

    drawBall(ctx, drawPos, this.size, this.color);
    this.drawHealthBar(ctx);

    // this.path.forEach((node) => {
    //   ctx.beginPath();
    //   ctx.arc(node.pos.x, node.pos.y, 5, 0, Math.PI * 2);
    //   ctx.fillStyle = "red";
    //   ctx.fill();
    //   ctx.closePath();
    // });

    // ctx.beginPath();
    // ctx.moveTo(this.position.x, this.position.y);
    // const { x, y } = player.getPosition();
    // ctx.lineTo(x, y);
    // ctx.strokeStyle = this.canSeePlayer ? "green" : "red";
    // ctx.stroke();
  }

  updateCanSeePlayer() {
    for (let obstacle of getObstacles(currentMap.layout)) {
      const { x, y } = obstacle.topLeftPoint;
      const vertexDeltas = [
        [0, 0, 50, 0],
        [0, 0, 0, 50],
        [50, 0, 50, 50],
        [0, 50, 50, 50],
      ];

      for (const [startDeltaX, startDeltaY, endDeltaX, endDeltaY] of vertexDeltas) {
        if (
          intersects(
            this.position,
            player.getPosition(),
            { x: x + startDeltaX, y: y + startDeltaY },
            { x: x + endDeltaX, y: y + endDeltaY }
          )
        ) {
          this.canSeePlayer = false;
          return;
        }
      }
    }

    this.canSeePlayer = true;
  }

  inflictDamage(damage: number) {
    this.currentHp = Math.max(0, this.currentHp - damage);

    numberAnimations.push(
      new RisingText({ x: this.position.x - this.size, y: this.position.y - this.size }, damage, "black")
    );

    if (this.currentHp <= 0) {
      this.die();
    }
  }

  private die() {
    this.shouldDraw = false;
    player.addExperience(this.reward);
    player.getCurrentWeapon().addExperience(this.reward);

    const numExpOrbs = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < numExpOrbs; i++) {
      const exp = Math.round(Math.random() * 20);
      const randomDirection = changeDirection({ x: 0, y: 1 }, Math.round(Math.random() * 360));
      miscellaneous.push(new ExperienceOrb(exp, this.position, randomDirection));
    }

    const randomDirection = changeDirection({ x: 0, y: 1 }, Math.round(Math.random() * 360));
    miscellaneous.push(new Money(this.reward, this.position, randomDirection));
  }

  hasSpawned() {
    return this.spawnTimeLeft <= 0;
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
