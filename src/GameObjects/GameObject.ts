import { Point } from "../lib/definitions";

export interface GameObjectConfig {
  position: Point;
  size: number;
  color: string;
}

export abstract class GameObject {
  private drawPosition: Point = { x: -100, y: -100 };
  protected position: Point = { x: -100, y: -100 };
  protected size: number;
  protected color: string;
  public shouldDraw = true;

  constructor(config: GameObjectConfig) {
    this.size = config.size;
    this.color = config.color;
    this.setPosition(config.position);
  }

  protected setPosition(pos: Point) {
    this.position = { x: pos.x, y: pos.y };
    this.drawPosition = { x: Math.round(pos.x), y: Math.round(pos.y) };
  }

  getPosition() {
    return { x: this.position.x, y: this.position.y };
  }

  getDrawPosition() {
    return this.drawPosition;
  }

  getColor() {
    return this.color;
  }

  abstract tick(): void;

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
