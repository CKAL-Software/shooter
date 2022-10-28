import { enemies, gameStats, map, miscellaneous, numberAnimations, player, projectiles } from "../../Shooter";
import { Point, TICK_DURATION_S } from "../../lib/definitions";
import { MovingObject } from "../MovingObject";
import { calculateDirection, calculateDistance, drawBall, getObstacles, pathToPoint } from "../../lib/canvasFunctions";
import { NumberAnimation } from "../NumberAnimation";
import { SNode } from "../../lib/models";
import { changeDirection, intercept, intersects } from "../../lib/functions";
import { NormalProjectile } from "../Projectiles/NormalProjectile";
import { ExperienceOrb } from "../Items/ExperienceOrb";

export interface EnemyConfiguration {
  startPosition: Point;
  hp: number;
  size: number;
  color: string;
  velocity: number;
  damage: number;
  reward: number;
}

export abstract class Enemy extends MovingObject {
  private maxHp: number;
  private currentHp: number;
  private color: string;
  private pathIndex = 0;
  private damage: number;
  private reward: number;
  private path: SNode[] = [];
  private ticksUntilPathRecalculated = 0;
  private shootCounter = 0;
  private canSeePlayer = false;
  private spawnTimeLeft = 4;

  constructor(configuration: EnemyConfiguration) {
    super(configuration.startPosition, configuration.velocity, configuration.size);
    this.velocity = configuration.velocity;
    this.maxHp = configuration.hp;
    this.currentHp = configuration.hp;
    this.size = configuration.size;
    this.color = configuration.color;
    this.damage = configuration.damage;
    this.reward = configuration.reward;
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

    if (this.canSeePlayer && calculateDistance(this.position, player.getPosition()) > player.getSize() + this.size) {
      const direction = calculateDirection(this.position, player.getPosition());
      const changeX = direction.x * this.velocity;
      const changeY = direction.y * this.velocity;
      this.shiftPosition(changeX, changeY);
      return;
    }

    if (this.path.length === 0) {
      return;
    }

    // follow path
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
    if (this.spawnTimeLeft > 0) {
      this.spawnTimeLeft -= TICK_DURATION_S;
      return;
    }

    this.updateCanSeePlayer();
    this.updateSurroundingObstacles();
    this.updatePath();

    if (this.canSeePlayer) {
      this.shootCounter--;

      if (this.shootCounter <= 0) {
        this.shootCounter = Math.round(Math.random() * 200) + 100;

        const playerPos = player.getPosition();
        const playerVel = player.getVelocity();

        const leadShotDirection = intercept(
          this.position,
          {
            x: playerPos.x,
            y: playerPos.y,
            vx: playerVel.x,
            vy: playerVel.y,
          },
          1.5
        );

        projectiles.push(
          new NormalProjectile({
            startPosition: this.position,
            direction: calculateDirection(this.position, leadShotDirection || player.getPosition()),
            velocity: 1.5,
            damage: 5,
            size: 5,
            color: "red",
            shotByPlayer: false,
          })
        );
      }
    }

    this.move();
  }

  updatePath() {
    this.ticksUntilPathRecalculated--;

    if (this.ticksUntilPathRecalculated <= 0) {
      this.ticksUntilPathRecalculated = 100;
      this.path = pathToPoint(map, this.position, player.getPosition()).slice(1);
    }

    if (this.path.length > 0 && calculateDistance(this.position, this.path[0].pos) <= 1) {
      this.path = this.path.slice(1);
    }
  }

  drawHealthBar(ctx: CanvasRenderingContext2D, doubleLength?: boolean) {
    const width = 40;
    const height = 8;

    ctx.beginPath();
    ctx.rect(
      this.drawPosition.x - (width / 2) * (doubleLength ? 2 : 1),
      this.drawPosition.y - (this.size + height + 4),
      width * (doubleLength ? 2 : 1),
      height
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      this.drawPosition.x - (width / 2) * (doubleLength ? 2 : 1),
      this.drawPosition.y - (this.size + height + 4),
      Math.round(width * (doubleLength ? 2 : 1) * (this.currentHp / this.maxHp)),
      height
    );
    ctx.fillStyle = "#3cff00";
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.spawnTimeLeft > 0) {
      drawBall(ctx, this.drawPosition, this.size * (1 - this.spawnTimeLeft / 4), this.color);
      return;
    }

    drawBall(ctx, this.drawPosition, this.size, this.color);
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
    for (let obstacle of getObstacles(map)) {
      const { x, y } = obstacle.topLeftPoint;
      const vertexDeltas = [
        [0, 0, 50, 0],
        [0, 0, 0, 50],
        [50, 0, 0, 50],
        [0, 50, 50, 0],
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
    gameStats.waveHealth -= Math.min(this.currentHp, damage);
    this.currentHp = Math.max(0, this.currentHp - damage);

    numberAnimations.push(
      new NumberAnimation({ x: this.position.x - this.size, y: this.position.y - this.size }, damage)
    );

    if (this.currentHp <= 0) {
      this.die();
    }
  }

  private die() {
    this.shouldDraw = false;
    player.addExperience(this.reward);

    const numExpOrbs = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numExpOrbs; i++) {
      const exp = Math.round(Math.random() * 20);
      const randomDirection = changeDirection({ x: 0, y: 1 }, Math.round(Math.random() * 360));
      miscellaneous.push(new ExperienceOrb(exp, this.position, randomDirection));
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
