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
import { ControlPanel } from "./components/InfoPanels/controlPanel/controlPanel";
import { Direction } from "./lib/models";
import { GameObject } from "./GameObjects/GameObject";
import { generateRandomMap, getPredefinedTeleporters, getSeededRandomGenerator, posToKey } from "./lib/functions";
import { getRandomInt } from "./lib/utils";
import { AiOutlineAim } from "react-icons/ai";
import { MenuContainer } from "./components/menu/menuContainer";
import { TriggerRenderContext } from "./lib/contexts";
import { BasicEnemy } from "./GameObjects/Enemies/BasicEnemy";
import { ShopContainer } from "./components/shop/shopContainer";
import { Gun } from "./Weapons/Gun";
import { Shotgun } from "./Weapons/Shotgun";
import { Sniper } from "./Weapons/Sniper";
import { GiSpikyExplosion } from "react-icons/gi";
import { GameInfo } from "./components/InfoPanels/gameInfo/gameInfo";

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
export const enemies: Enemy[] = [];
export let timeUntilNextSpawn = 0;
export let enemiesCounter = 1;
export let enemiesLeft = 10;
export const miscellaneous: GameObject[] = [];
export const numberAnimations: RisingText[] = [];
export const projectiles: ActualProjectile[] = [];
export let mousePos: Point = { x: 0, y: 0 };
export let menuOpen = false;
export let shopOpen = false;
export const shopItems: Gun[] = [new Shotgun(), new Sniper()];

let hasTeleported = 0;
let canOpenShop = true;

export function Shooter() {
  const [anims, setAnims] = useState<RisingText[]>([]);
  const [tint, setTint] = useState(0);
  const [tintColor, setTintColor] = useState("0,0,0");
  const [currentMapPosition, setCurrentMapPosition] = useState(currentMap.position);
  const [allMaps, setAllMaps] = useState(maps);
  const [menuOpenState, setMenuOpenState] = useState(false);
  const [shopOpenState, setShopOpenState] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setRerenderFlip] = useState(false);

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
        if (shopOpen) {
          shopOpen = !shopOpen;
          setShopOpenState(false);
        } else {
          menuOpen = !menuOpen;
          setMenuOpenState((open) => !open);
        }
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
        if (menuOpen || shopOpen) return;

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
          const size = 8;
          crosshair.style.height = size + "px";
          crosshair.style.width = size + "px";
        }

        const tileState = player.getTileState();
        if (tileState.includes("tp") && hasTeleported <= 0 && enemies.length === 0) {
          const tpSide = tileState.replace("tp-", "") as MapSide;
          const newMapPosition = {
            x: currentMap.position.x + (tileState === "tp-left" ? -1 : tileState === "tp-right" ? 1 : 0),
            y: currentMap.position.y + (tileState === "tp-up" ? -1 : tileState === "tp-down" ? 1 : 0),
          };
          const existingMap = maps.get(posToKey(newMapPosition));
          if (existingMap) {
            currentMap = existingMap;
          } else {
            const teleporters = { up: { size: 1 }, right: { size: 2 }, down: { size: 3 }, left: { size: 4 } };
            const predefinedTeleporters = getPredefinedTeleporters(maps, newMapPosition);
            Object.entries(predefinedTeleporters).forEach(([side, tpInfo]) => (teleporters[side as MapSide] = tpInfo));
            currentMap = generateRandomMap({
              position: newMapPosition,
              rng: r,
              numStructures: 7,
              teleporters: teleporters,
            });
            maps.set(posToKey(currentMap.position), currentMap);
            enemiesCounter++;
            enemiesLeft = enemiesCounter;
          }
          player.enterTeleporter(tpSide);
          hasTeleported = 2;
        } else if (tileState === "shop" && canOpenShop) {
          setShopOpenState(true);
          shopOpen = true;
          canOpenShop = false;
        } else if (tileState === "none") {
          canOpenShop = true;
        }

        hasTeleported -= TICK_DURATION_S;

        timeUntilNextSpawn -= TICK_DURATION_S;

        if (timeUntilNextSpawn < 0 && enemiesLeft > 0) {
          timeUntilNextSpawn = 10;
          enemiesLeft--;
          enemies.push(
            new BasicEnemy({ level: 1, position: findRandomLocation(currentMap.layout, player.getPosition()) })
          );
        }

        setAnims([...numberAnimations]);

        setTint(player.getTintIntencity());
        setTintColor(player.getTintColor());

        setCurrentMapPosition(currentMap.position);
        setAllMaps(new Map(maps));
      }, TICK_DURATION);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [anims]);

  return (
    <TriggerRenderContext.Provider value={() => setRerenderFlip((flip) => !flip)}>
      <div style={{ position: "relative" }}>
        {menuOpenState && <MenuContainer />}
        {shopOpenState && <ShopContainer />}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "48px",
            outline: "none",
          }}
          onKeyDown={(e) => {}}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          tabIndex={0}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", columnGap: 24 }}>
            <GameInfo />
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
                      {anim.getIsCriticalHit() && (
                        <GiSpikyExplosion style={{ marginBottom: -4, marginLeft: 4, fontSize: 20 }} />
                      )}
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
            <ControlPanel maps={allMaps} currentMapPosition={currentMapPosition} vision={3} />
          </div>
        </div>
      </div>
    </TriggerRenderContext.Provider>
  );
}
