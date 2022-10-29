import { useEffect, useState } from "react";
import {
  drawBackground,
  drawAndCleanupObjects,
  getMousePos,
  getObstacles,
  findRandomLocation,
} from "./lib/canvasFunctions";
import {
  Point,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TICK_DURATION,
  ActualProjectile,
  TICK_DURATION_S,
} from "./lib/definitions";
import { Enemy } from "./GameObjects/Enemies/Enemy";
import { standardMap } from "./Definitions/Maps";
import { Player } from "./GameObjects/Player";
import { NumberAnimation } from "./GameObjects/NumberAnimation";
import { ControlPanel } from "./components/controlPanel";
import { BasicEnemy } from "./GameObjects/Enemies/BasicEnemy";
import { Direction } from "./lib/models";
import { GameObject } from "./GameObjects/GameObject";

const moveDirections = new Set<Direction>();

export let map = standardMap;
export let obstacles = getObstacles(map);
export const player = new Player();
export const enemies: Enemy[] = [new BasicEnemy({ x: 200, y: 400 })];
export let timeUntilNextSpawn = 3;
export const miscellaneous: GameObject[] = [];
export const numberAnimations: NumberAnimation[] = [];
export const projectiles: ActualProjectile[] = [];
export let mousePos: Point = { x: 0, y: 0 };
export let gameStats = {
  money: 10,
  points: 0,
  health: 100,
  isPaused: true,
  requestForPause: false,
  isFast: false,
  waveHealth: 10,
};

export function Shooter() {
  const [nums, setNums] = useState<NumberAnimation[]>([]);
  const [hp, setHp] = useState(0);
  const [maxHp, setMaxHp] = useState(0);
  const [magAmmo, setMagAmmo] = useState(0);
  const [magSize, setMagSize] = useState(0);
  const [ammo, setAmmo] = useState(0);
  const [playerExp, setPlayerExp] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [weaponExp, setWeaponExp] = useState(0);
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [fireRate, setFireRate] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [weaponVelocity, setWeaponVelocity] = useState(0);
  const [weaponName, setWeaponName] = useState("");
  const [reloadProgress, setReloadProgress] = useState(0);
  const [tint, setTint] = useState(0);
  const [tintColor, setTintColor] = useState("0,0,0");

  useEffect(() => {
    const canvas2 = document.getElementById("background-layer") as HTMLCanvasElement;
    const bg = canvas2.getContext("2d");

    let id: NodeJS.Timeout;

    if (bg) {
      drawBackground(bg, map);
    }

    const canvas = document.getElementById("game-layer") as HTMLCanvasElement;
    const upperDiv = document.getElementById("tint") as HTMLCanvasElement;
    const game = canvas.getContext("2d");

    window.onkeydown = (keyEvent) => {
      if (["a", "s", "d", "w"].includes(keyEvent.key)) {
        moveDirections.add(keyEvent.key as Direction);
        player.setMoveDirections(moveDirections);
      }

      if (keyEvent.key === "r") {
        player.reload();
      }

      if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(keyEvent.key)) {
        player.changeWeapon(keyEvent.key === "0" ? 9 : Number(keyEvent.key) - 1);
      }
    };

    window.onkeyup = (keyEvent) => {
      moveDirections.delete(keyEvent.key as Direction);
      player.setMoveDirections(moveDirections);
    };

    upperDiv.onmousemove = (mouseEvent) => {
      mousePos = getMousePos(canvas, mouseEvent);
    };

    upperDiv.onmousedown = () => {
      player.setWantFire(true);
    };

    upperDiv.onmouseup = () => {
      player.setWantFire(false);
    };

    if (game) {
      id = setInterval(() => {
        game.clearRect(0, 0, canvas.width, canvas.height);

        drawAndCleanupObjects(game, [player]);
        drawAndCleanupObjects(game, enemies);
        drawAndCleanupObjects(game, projectiles);
        drawAndCleanupObjects(game, miscellaneous);
        drawAndCleanupObjects(game, numberAnimations);

        projectiles.forEach((obj) => obj.tick());
        enemies.forEach((obj) => obj.tick());
        numberAnimations.forEach((obj) => obj.tick());
        miscellaneous.forEach((obj) => obj.tick());
        player.tick();

        timeUntilNextSpawn -= TICK_DURATION_S;

        if (timeUntilNextSpawn < 0) {
          timeUntilNextSpawn = 3;
          enemies.push(new BasicEnemy(findRandomLocation()));
        }

        setNums([...numberAnimations]);

        setHp(player.getHealth());
        setAmmo(player.getCurrentWeapon().getAmmo());
        setMagSize(player.getCurrentWeapon().getMagazineSize());
        setMagAmmo(player.getCurrentWeapon().getMagazineAmmo());
        setPlayerExp(player.getExperience());
        setPlayerLevel(player.getLevel());
        setMaxHp(player.getMaxHealth());
        setWeaponExp(player.getCurrentWeapon().getExperience());
        setWeaponLevel(player.getCurrentWeapon().getLevel());
        setWeaponVelocity(player.getCurrentWeapon().getVelocity());
        setVelocity(player.getVelocity());
        setFireRate(player.getCurrentWeapon().getFireRate());
        setWeaponName(player.getCurrentWeapon().getName());
        setReloadProgress(player.getCurrentWeapon().getReloadProgress());
        setTint(player.getTintIntencity());
        setTintColor(player.getTintColor());
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
            <div
              id="tint"
              style={{
                height: CANVAS_HEIGHT,
                width: CANVAS_WIDTH,
                position: "absolute",
                zIndex: 4,
                backgroundColor: `rgba(${tintColor},${tint})`,
                // backgroundColor: `rgba(0,0,0,0)`,
              }}
            />
          </div>
          <ControlPanel
            hp={hp}
            maxHp={maxHp}
            magSize={magSize}
            magAmmo={magAmmo}
            ammo={ammo}
            playerExp={playerExp}
            playerLevel={playerLevel}
            weaponExp={weaponExp}
            weaponLevel={weaponLevel}
            velocity={velocity}
            weaponVelocity={weaponVelocity}
            fireRate={fireRate}
            weaponName={weaponName}
            reloadProgress={reloadProgress}
          />
        </div>
      </div>
    </div>
  );
}
