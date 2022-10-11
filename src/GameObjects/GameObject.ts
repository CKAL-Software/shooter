export abstract class GameObject {
  public shouldDraw = true;

  abstract tick(): void;

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
