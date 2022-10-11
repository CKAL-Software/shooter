import { useState } from "react";
import {
  GiArcheryTarget,
  GiBroadsword,
  GiCrossedSwords,
  GiBullets,
  GiSupersonicBullet,
  GiTwoCoins,
  GiUpgrade,
  GiPiercedBody,
  GiStrikingBalls,
} from "react-icons/gi";
import { GrNext, GrPrevious } from "react-icons/gr";
import { RiDeleteBin4Line } from "react-icons/ri";
import { gameStats } from "../Shooter";
import { TargetingMode, TargetingModes } from "../lib/definitions";
import { Tower } from "../GameObjects/Towers/Tower";
import { Button } from "./button";
import { Property } from "./property";
import { IoMdSnow } from "react-icons/io";
import { PiercingProjectile } from "../GameObjects/Projectiles/PiercingProjectile";
import { FreezerTower } from "../GameObjects/Towers/FreezerTower";
import { BoatTower } from "../GameObjects/Towers/BoatTower";

interface TowerSectionProps {
  selectedTower: Tower;
  targetingMode: TargetingMode;
  clearSelectedTower(): void;
}

export function TowerSection(props: TowerSectionProps) {
  const [showUpgradeStats, setShowUpgradeStats] = useState(false);

  const { htmlRender, color, name, projectileSpec, roundsPerMins, ranges, prices, towerConstructor } =
    props.selectedTower.getSpec();

  const currDamage = projectileSpec.damages[props.selectedTower.getLevel()];
  const currRpm = roundsPerMins[props.selectedTower.getLevel()];
  const currRange = ranges[props.selectedTower.getLevel()];
  const currVel = projectileSpec.velocities[props.selectedTower.getLevel()];
  const currSlow = projectileSpec.slows ? projectileSpec.slows[props.selectedTower.getLevel()] : 0;

  const diffDamage = Number((projectileSpec.damages[props.selectedTower.getLevel() + 1] - currDamage).toFixed(3));
  const diffRpm = Number((roundsPerMins[props.selectedTower.getLevel() + 1] - currRpm).toFixed(3));
  const diffRange = Number((ranges[props.selectedTower.getLevel() + 1] - currRange).toFixed(3));
  const diffVel = Number((projectileSpec.velocities[props.selectedTower.getLevel() + 1] - currVel).toFixed(3));
  const diffSlow = Number(
    ((projectileSpec.slows ? projectileSpec.slows[props.selectedTower.getLevel() + 1] : 0) - currSlow).toFixed(3)
  );

  function changeTargetingMode(forward: boolean) {
    const index = TargetingModes.indexOf(props.targetingMode);
    if (index === 0 && !forward) {
      props.selectedTower.setTargetingMode(TargetingModes[TargetingModes.length - 1]);
    } else {
      props.selectedTower.setTargetingMode(TargetingModes[(index + (forward ? 1 : -1)) % TargetingModes.length]);
    }
  }

  return (
    <div style={{ padding: "12px 12px 24px", height: "calc(100% - 36px)", fontSize: "18px" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>{htmlRender(color)}</div>
            <div style={{ marginLeft: "16px" }}>{name}</div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "auto min-content", columnGap: "24px", marginTop: "16px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "min-content",
                columnGap: "12px",
                marginTop: "4px",
                rowGap: "8px",
                gridAutoRows: "min-content",
              }}
            >
              <Property
                value={props.selectedTower.getLevel() + 1}
                icon={<GiUpgrade style={{ marginLeft: "6px", color: "black" }} />}
              />
              <Property
                value={props.selectedTower.getDamageDealt()}
                icon={<GiCrossedSwords style={{ marginLeft: "6px", color: "black" }} />}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "min-content",
                columnGap: "12px",
                marginTop: "4px",
                rowGap: "8px",
              }}
            >
              <Property
                value={`${showUpgradeStats && diffDamage ? `${diffDamage} + ` : ""}${currDamage}`}
                icon={<GiBroadsword style={{ marginLeft: "6px", color: "black" }} />}
              />
              <Property
                value={`${showUpgradeStats && diffRpm ? `${diffRpm} + ` : ""}${currRpm}`}
                icon={<GiBullets style={{ marginLeft: "6px", color: "black" }} />}
              />
              <Property
                value={`${showUpgradeStats && diffRange ? `${diffRange} + ` : ""}${currRange}`}
                icon={<GiArcheryTarget style={{ marginLeft: "6px", color: "black" }} />}
              />
              <Property
                value={`${showUpgradeStats && diffVel ? `${diffVel} + ` : ""}${currVel}`}
                icon={<GiSupersonicBullet style={{ marginLeft: "6px", color: "black" }} />}
              />
              {projectileSpec.slows && (
                <Property
                  value={`${showUpgradeStats && diffSlow ? `${diffSlow} + ` : ""}${currSlow}`}
                  icon={<IoMdSnow style={{ marginLeft: "6px", color: "black" }} />}
                />
              )}
              {projectileSpec.projectileConstructor === PiercingProjectile && (
                <Property
                  value={`${showUpgradeStats ? `${1} + ` : ""}${props.selectedTower.getLevel() + 2}`}
                  icon={<GiPiercedBody style={{ marginLeft: "6px", color: "black" }} />}
                />
              )}
              {(towerConstructor === FreezerTower || towerConstructor === BoatTower) && (
                <Property
                  value={`${showUpgradeStats && towerConstructor === FreezerTower ? `${1} + ` : ""}${
                    towerConstructor === FreezerTower ? props.selectedTower.getLevel() + 1 : 3
                  }`}
                  icon={<GiStrikingBalls style={{ marginLeft: "6px", color: "black" }} />}
                />
              )}
            </div>
          </div>
          <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "16px" }}>Targeting</div>
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {props.selectedTower.getSpec().towerConstructor !== FreezerTower && (
              <GrPrevious onClick={() => changeTargetingMode(false)} style={{ cursor: "pointer" }} />
            )}
            <div style={{ width: "100px", textAlign: "center" }}>{props.targetingMode}</div>
            {props.selectedTower.getSpec().towerConstructor !== FreezerTower && (
              <GrNext onClick={() => changeTargetingMode(true)} style={{ cursor: "pointer" }} />
            )}
          </div>
        </div>

        <div>
          {props.selectedTower.getLevel() + 1 !== prices.length && (
            <Button
              danger
              disabled={
                gameStats.money < props.selectedTower.getUpgradePrice() ||
                props.selectedTower.getLevel() + 1 === prices.length
              }
              onClick={() => props.selectedTower.levelUp()}
              onHover={setShowUpgradeStats}
              style={{ width: "100%" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  <GiUpgrade style={{ marginBottom: "-3px", marginRight: "8px" }} />
                  Upgrade
                </span>
                <span style={{ marginLeft: "16px" }}>
                  {props.selectedTower.getUpgradePrice()} <GiTwoCoins style={{ marginBottom: "-3px" }} />
                </span>
              </div>
            </Button>
          )}
          <Button
            danger
            onClick={() => {
              props.selectedTower.sell();
              props.clearSelectedTower();
            }}
            style={{ width: "100%", marginTop: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <RiDeleteBin4Line style={{ marginBottom: "-3px", marginRight: "8px" }} />
                Sell
              </span>
              <span style={{ marginLeft: "16px" }}>
                {props.selectedTower.getSellPrice()} <GiTwoCoins style={{ marginBottom: "-3px" }} />
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
