import { enemies } from "../../Shooter";
import { calculateDistance } from "../../lib/canvasFunctions";
import { CANVAS_HEIGHT, CANVAS_WIDTH, Point } from "../../lib/definitions";
import { Projectile } from "./Projectile";

export class NormalProjectile extends Projectile {
  private direction: Point;

  constructor(startPosition: Point, velocity: number, damage: number, size: number, color: string, direction: Point) {
    super(startPosition, velocity, damage, size, color);

    this.direction = direction;
  }

  private checkIfVisible() {
    if (
      this.position.x < 0 ||
      this.position.x > CANVAS_WIDTH ||
      this.position.y < 0 ||
      this.position.y > CANVAS_HEIGHT
    ) {
      this.shouldDraw = false;
    }
  }

  hitEnemyIfCollision() {
    const enemyHit = enemies.find(
      (enemy) => calculateDistance(this.position, enemy.getPosition()) <= enemy.getSize() + this.size
    );

    if (enemyHit) {
      this.hitEnemy(enemyHit);
    }
  }

  move() {
    const changeX = this.direction.x * this.velocity;
    const changeY = this.direction.y * this.velocity;

    this.shiftPosition(changeX, changeY);
  }

  tick() {
    this.move();
    this.hitEnemyIfCollision();
    this.checkIfVisible();
  }
}
