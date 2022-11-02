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
  MapInfo,
  MapSide,
} from "./lib/definitions";
import { Enemy } from "./GameObjects/Enemies/Enemy";
import { Player } from "./GameObjects/Player";
import { RisingText } from "./GameObjects/RisingText";
import { ControlPanel } from "./components/controlPanel";
import { BasicEnemy } from "./GameObjects/Enemies/BasicEnemy";
import { Direction } from "./lib/models";
import { GameObject } from "./GameObjects/GameObject";
import {
  flipSide,
  generateRandomMap,
  getPredefinedTeleporters,
  getSeededRandomGenerator,
  posToKey,
} from "./lib/functions";
import { getRandomInt } from "./lib/utils";
import { Minimap } from "./components/minimap";
import { AiOutlineAim } from "react-icons/ai";
import { MenuContainer } from "./components/menu/menuContainer";

const moveDirections = new Set<Direction>();
const r = getSeededRandomGenerator(getRandomInt(0, 100));
export let currentMap = generateRandomMap({
  position: { x: 0, y: 0 },
  rng: r,
  numStructures: 7,
  teleporters: { up: { size: 1 }, right: { size: 2 }, down: { size: 3 }, left: { size: 4 } },
});
const maps = new Map<string, MapInfo>();
maps.set(currentMap.position.x + "," + currentMap.position.y, currentMap);
export let obstacles = getObstacles(currentMap.layout);
export const player = new Player();
export const enemies: Enemy[] = [new BasicEnemy({ x: 200, y: 400 })];
export let timeUntilNextSpawn = 3;
export const miscellaneous: GameObject[] = [];
export const numberAnimations: RisingText[] = [];
export const projectiles: ActualProjectile[] = [];
export let mousePos: Point = { x: 0, y: 0 };
export let menuOpen = false;

let hasTeleported = 0;

export function Shooter() {
  const [anims, setAnims] = useState<RisingText[]>([]);
  const [hp, setHp] = useState(0);
  const [maxHp, setMaxHp] = useState(0);
  const [magAmmo, setMagAmmo] = useState(0);
  const [magSize, setMagSize] = useState(0);
  const [ammo, setAmmo] = useState(0);
  const [money, setMoney] = useState(0);
  const [playerExp, setPlayerExp] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [weaponExp, setWeaponExp] = useState(0);
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [fireRate, setFireRate] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [weaponVelocity, setWeaponVelocity] = useState(0);
  const [weaponName, setWeaponName] = useState("");
  const [reloadProgress, setReloadProgress] = useState(0);
  const [reloadTime, setReloadTime] = useState(0);
  const [tint, setTint] = useState(0);
  const [tintColor, setTintColor] = useState("0,0,0");
  const [currentMapPosition, setCurrentMapPosition] = useState(currentMap.position);
  const [allMaps, setAllMaps] = useState(maps);
  const [menuOpenState, setMenuOpenState] = useState(false);

  useEffect(() => {
    const canvas2 = document.getElementById("background-layer") as HTMLCanvasElement;
    const bg = canvas2.getContext("2d");

    let id: NodeJS.Timeout;

    if (bg) {
      drawBackground(bg, currentMap.layout);
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

      if (["Escape", "p"].includes(keyEvent.key)) {
        menuOpen = !menuOpen;
        setMenuOpenState((open) => !open);
      }
    };

    window.onkeyup = (keyEvent) => {
      moveDirections.delete(keyEvent.key as Direction);
      player.setMoveDirections(moveDirections);
    };

    upperDiv.onmousemove = (mouseEvent) => {
      mousePos = getMousePos(canvas, mouseEvent);

      const crosshair = document.getElementById("crosshair");
      if (!crosshair) {
        return;
      }

      crosshair.style.transform = `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`;
    };

    upperDiv.onmousedown = () => {
      player.setWantFire(true);
    };

    upperDiv.onmouseup = () => {
      player.setWantFire(false);
    };

    if (game) {
      id = setInterval(() => {
        if (menuOpen) return;

        game.clearRect(0, 0, canvas.width, canvas.height);

        drawAndCleanupObjects(game, enemies);
        drawAndCleanupObjects(game, projectiles);
        drawAndCleanupObjects(game, miscellaneous);
        drawAndCleanupObjects(game, numberAnimations);
        drawAndCleanupObjects(game, [player]);

        projectiles.forEach((obj) => obj.tick());
        enemies.forEach((obj) => obj.tick());
        numberAnimations.forEach((obj) => obj.tick());
        miscellaneous.forEach((obj) => obj.tick());
        player.tick();

        const crosshair = document.getElementById("crosshair");
        if (crosshair) {
          const size = Math.max(8, 3 * player.getCurrentWeapon().getRecoil());
          crosshair.style.height = size + "px";
          crosshair.style.width = size + "px";
        }

        const teleportSide = player.getTeleportSide();
        if (teleportSide !== "none" && hasTeleported <= 0) {
          const newMapPosition = {
            x: currentMap.position.x + (teleportSide === "left" ? -1 : teleportSide === "right" ? 1 : 0),
            y: currentMap.position.y + (teleportSide === "up" ? -1 : teleportSide === "down" ? 1 : 0),
          };
          const existingMap = maps.get(posToKey(newMapPosition));
          if (existingMap) {
            currentMap = existingMap;
          } else {
            const teleporters = { up: { size: 1 }, right: { size: 2 }, down: { size: 3 }, left: { size: 4 } };
            const predefinedTeleporters = getPredefinedTeleporters(maps, newMapPosition);
            Object.entries(predefinedTeleporters).forEach(([side, tpInfo]) => (teleporters[side as MapSide] = tpInfo));
            teleporters[flipSide(teleportSide)] = currentMap.teleporters[teleportSide];
            currentMap = generateRandomMap({
              position: newMapPosition,
              rng: r,
              numStructures: 7,
              teleporters: teleporters,
            });
            maps.set(posToKey(currentMap.position), currentMap);
          }
          player.enterTeleporter(teleportSide);
          hasTeleported = 2;
        }

        hasTeleported -= TICK_DURATION_S;

        // timeUntilNextSpawn -= TICK_DURATION_S;

        if (timeUntilNextSpawn < 0) {
          timeUntilNextSpawn = 3;
          enemies.push(new BasicEnemy(findRandomLocation(currentMap.layout)));
        }

        setAnims([...numberAnimations]);

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
        setReloadTime(player.getCurrentWeapon().getReloadTime());
        setCurrentMapPosition(currentMap.position);
        setAllMaps(new Map(maps));
        setMoney(player.getMoney());
      }, TICK_DURATION);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [anims]);

  return (
    <div style={{ position: "relative" }}>
      {menuOpenState && <MenuContainer />}
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
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ padding: 24 }}>
              <Minimap maps={allMaps} currentMapPosition={currentMapPosition} vision={3} />
            </div>
          </div>
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
                <div id="crosshair" style={{ marginLeft: -13, marginTop: -13 }}>
                  <AiOutlineAim style={{ fontSize: 26, verticalAlign: 0, color: "rgba(0,0,0,0.5)" }} />
                </div>
                {anims.map((anim) => (
                  <div
                    key={anim.getId()}
                    style={{
                      left: anim.getX(),
                      top: anim.getY(),
                      position: "absolute",
                      fontWeight: "bold",
                      lineHeight: 0,
                      color: anim.getColor(),
                    }}
                    className="number-flow"
                  >
                    {anim.getText()}
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
                cursor: "none",
                // backgroundColor: `rgba(0,0,0,0)`,
              }}
            />
          </div>
          <ControlPanel
            hp={hp}
            maxHp={maxHp}
            money={money}
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
            reloadTime={reloadTime}
          />
        </div>
      </div>
    </div>
  );
}
