import { useEffect } from "react";
import {
  calculatePathFromLevel,
  drawBackground,
  drawAndCleanupObjects,
  getMousePos,
  calculateDirection,
} from "./lib/canvasFunctions";
import { ControlPanel } from "./components/controlPanel";
import { Point, CANVAS_HEIGHT, CANVAS_WIDTH, TICK_DURATION, ActualProjectile } from "./lib/definitions";
import { Enemy } from "./GameObjects/Enemies/Enemy";
import { standardMap } from "./Definitions/Maps";
import { Player } from "./GameObjects/Player";
import { NormalProjectile } from "./GameObjects/Projectiles/NormalProjectile";
import { BasicEnemy } from "./GameObjects/Enemies/BasicEnemy";

const keysDownMap = new Set<string>();

let tick = 0;
export let map = standardMap;
export const path = calculatePathFromLevel(map);
export const player = new Player();
export const enemies: Enemy[] = [
  new BasicEnemy({ x: 200, y: 200 }, 50, 1, 60, 100),
  new BasicEnemy({ x: 100, y: 100 }, 50, 1, 60, 100),
  new BasicEnemy({ x: 100, y: 150 }, 150, 1, 60, 100),
];
export const projectiles: ActualProjectile[] = [];
let mousePos: Point = { x: 0, y: 0 };
export let gameStats = {
  money: 10,
  points: 0,
  health: 100,
  isPaused: true,
  requestForPause: false,
  isFast: false,
  waveHealth: 10,
};

interface TowerDefenseProps {}

export function Shooter(props: TowerDefenseProps) {
  useEffect(() => {
    const canvas2 = document.getElementById("background-layer") as HTMLCanvasElement;
    const bg = canvas2.getContext("2d");

    let id: NodeJS.Timeout;

    if (bg) {
      drawBackground(bg, map);
    }

    const canvas = document.getElementById("game-layer") as HTMLCanvasElement;
    const game = canvas.getContext("2d");

    window.onkeydown = (keyEvent) => {
      keysDownMap.add(keyEvent.key);
    };

    window.onkeyup = (keyEvent) => {
      keysDownMap.delete(keyEvent.key);
    };

    canvas.onmousemove = (mouseEvent) => {
      mousePos = getMousePos(canvas, mouseEvent);
    };

    canvas.onmousedown = (mouseEvent) => {
      projectiles.push(
        new NormalProjectile(
          player.getPosition(),
          3,
          10,
          10,
          "black",
          calculateDirection(player.getPosition(), mousePos)
        )
      );
    };

    if (game) {
      id = setInterval(() => {
        if (!gameStats.isFast && tick % 2 === 0) {
          tick++;
          return;
        }

        game.clearRect(0, 0, canvas.width, canvas.height);

        keysDownMap.forEach((d) => player.move(d));

        drawAndCleanupObjects(game, [player]);
        drawAndCleanupObjects(game, projectiles);
        drawAndCleanupObjects(game, enemies);

        projectiles.forEach((obj) => obj.tick());
        enemies.forEach((obj) => obj.tick());

        game.beginPath();
        const playerPos = player.getPosition();
        game.moveTo(playerPos.x, playerPos.y);
        game.lineTo(mousePos.x, mousePos.y);
        game.stroke();

        tick++;
      }, TICK_DURATION);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "48px",
          outline: "none",
        }}
        onKeyDown={(e) => {}}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        tabIndex={0}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              position: "relative",
              height: CANVAS_HEIGHT,
              width: CANVAS_WIDTH,
            }}
          >
            <canvas id="background-layer" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ zIndex: 1 }} />
            <canvas id="game-layer" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ zIndex: 2 }} />
          </div>
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}
