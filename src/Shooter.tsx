import { useEffect, useState } from "react";
import {
  drawBackground,
  drawAndCleanupObjects,
  getMousePos,
  calculateDirection,
  getObstacles,
} from "./lib/canvasFunctions";
import { Point, CANVAS_HEIGHT, CANVAS_WIDTH, TICK_DURATION, ActualProjectile } from "./lib/definitions";
import { Enemy } from "./GameObjects/Enemies/Enemy";
import { standardMap } from "./Definitions/Maps";
import { Player } from "./GameObjects/Player";
import { NormalProjectile } from "./GameObjects/Projectiles/NormalProjectile";
import { NumberAnimation } from "./GameObjects/NumberAnimation";
import { ControlPanel } from "./components/controlPanel";
import { BasicEnemy } from "./GameObjects/Enemies/BasicEnemy";

const keysDownMap = new Set<string>();

let tick = 0;
export let map = standardMap;
export let obstacles = getObstacles(map);
export const player = new Player();
export const enemies: Enemy[] = [
  // new BasicEnemy({ x: 200, y: 400 }, 50, 1, 60, 100),
  new BasicEnemy({ x: 100, y: 100 }, 50, 0.2, 60, 100),
  // new BasicEnemy({ x: 100, y: 150 }, 150, 1, 60, 100),
];
export const numberAnimations: NumberAnimation[] = [];
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
  const [nums, setNums] = useState<NumberAnimation[]>([]);

  useEffect(() => {
    const canvas2 = document.getElementById("background-layer") as HTMLCanvasElement;
    const bg = canvas2.getContext("2d");

    let id: NodeJS.Timeout;

    if (bg) {
      drawBackground(bg, map);
    }

    const canvas = document.getElementById("game-layer") as HTMLCanvasElement;
    const numbersDiv = document.getElementById("numbers") as HTMLCanvasElement;
    const game = canvas.getContext("2d");

    window.onkeydown = (keyEvent) => {
      keysDownMap.add(keyEvent.key);
    };

    window.onkeyup = (keyEvent) => {
      keysDownMap.delete(keyEvent.key);
    };

    numbersDiv.onmousemove = (mouseEvent) => {
      mousePos = getMousePos(canvas, mouseEvent);
    };

    numbersDiv.onmousedown = (mouseEvent) => {
      // const angle = Math.random() * Math.PI * 2;
      // const x = Math.cos(angle) * 50;
      // const y = Math.sin(angle) * 50;

      const direction = calculateDirection(player.getPosition(), { x: mousePos.x, y: mousePos.y });

      const ang = (Math.random() * 30 - 15) * (Math.PI / 180);

      const angledDirection = {
        x: direction.x * Math.cos(ang) - direction.y * Math.sin(ang),
        y: direction.x * Math.sin(ang) + direction.y * Math.cos(ang),
      };

      projectiles.push(new NormalProjectile(player.getPosition(), 3, 10, 10, "black", angledDirection, true));
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
        drawAndCleanupObjects(game, enemies);
        drawAndCleanupObjects(game, projectiles);
        drawAndCleanupObjects(game, numberAnimations);

        projectiles.forEach((obj) => obj.tick());
        enemies.forEach((obj) => obj.tick());
        numberAnimations.forEach((obj) => obj.tick());

        setNums([...numberAnimations]);

        tick++;
      }, TICK_DURATION);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [nums]);

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}>
          {/* <div style={{ display: "flex" }}> */}
          <div />
          <div
            style={{
              position: "relative",
              height: CANVAS_HEIGHT,
              width: CANVAS_WIDTH,
            }}
          >
            <canvas id="background-layer" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ zIndex: 1 }} />
            <canvas id="game-layer" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ zIndex: 2 }} />
            <div id="numbers" style={{ height: CANVAS_HEIGHT, width: CANVAS_WIDTH, zIndex: 3 }}>
              <div style={{ height: CANVAS_HEIGHT, width: CANVAS_WIDTH, userSelect: "none" }}>
                {nums.map((na) => (
                  <div
                    key={na.getId()}
                    style={{ left: na.getX(), top: na.getY(), position: "absolute", fontWeight: "bold", lineHeight: 0 }}
                    className="number-flow"
                  >
                    {na.getNumber()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}
