import { useCallback, useEffect, useState } from "react";
import { calculatePathFromLevel, drawBackground, drawAndCleanupObjects, getMousePos } from "./lib/canvasFunctions";
import { ControlPanel } from "./components/controlPanel";
import { Point, ActualTower, ActualProjectile, CANVAS_HEIGHT, CANVAS_WIDTH, TICK_DURATION } from "./lib/definitions";
import { Enemy } from "./GameObjects/Enemies/Enemy";
import { waves } from "./Definitions/Waves";
import { Tower } from "./GameObjects/Towers/Tower";
import { standardMap } from "./Definitions/Maps";
import { Player } from "./GameObjects/Player";

const keysDownMap = new Set<string>();

let tick = 0;
export let map = standardMap;
export const path = calculatePathFromLevel(map);
export const enemiesManagers: { enemies: Enemy[]; waveNumber: number }[] = [];
export const projectiles: ActualProjectile[] = [];
export const towers: ActualTower[] = [];
export const player = new Player();
let mousePos: Point = { x: 0, y: 0 };
export let gameStats = {
  money: 10,
  points: 0,
  health: 100,
  isPaused: true,
  requestForPause: false,
  isFast: false,
  waveHealth: waves[0].amount * waves[0].hp,
};

export function allEnemies() {
  return enemiesManagers.reduce<Enemy[]>((prev, curr) => prev.concat(...curr.enemies), []);
}

interface TowerDefenseProps {}

export function Shooter(props: TowerDefenseProps) {
  const [towerToPlace, setTowerToPlace] = useState<ActualTower>();
  const [selectedTower, setSelectedTower] = useState<Tower>();

  const clearTowers = useCallback(() => {
    if (towerToPlace) {
      towerToPlace.shouldDraw = false;
    }
    if (selectedTower) {
      selectedTower.setDrawRange(false);
    }
    setTowerToPlace(undefined);
    setSelectedTower(undefined);
  }, [towerToPlace, selectedTower]);

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

    canvas.onmousedown = (mouseEvent) => {};

    if (game) {
      id = setInterval(() => {
        if (!gameStats.isFast && tick % 2 === 0) {
          tick++;
          return;
        }

        game.clearRect(0, 0, canvas.width, canvas.height);

        keysDownMap.forEach((d) => player.move(d));

        drawAndCleanupObjects(game, [player]);

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
  }, [towerToPlace, selectedTower, clearTowers]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "48px",
          outline: "none",
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (towerToPlace) {
              towers.splice(towers.indexOf(towerToPlace), 1);
              setTowerToPlace(undefined);
            }

            if (selectedTower) {
              selectedTower.setDrawRange(false);
              setSelectedTower(undefined);
            }
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (towerToPlace) {
            towers.splice(towers.indexOf(towerToPlace), 1);
            setTowerToPlace(undefined);
          }

          if (selectedTower) {
            selectedTower.setDrawRange(false);
            setSelectedTower(undefined);
          }
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
