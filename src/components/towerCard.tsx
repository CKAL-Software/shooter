import {
  GiArcheryTarget,
  GiTwoCoins,
  GiBullets,
  GiBroadsword,
  GiSupersonicBullet,
  GiStrikingBalls,
  GiPiercedBody,
} from "react-icons/gi";
import { IoMdSnow } from "react-icons/io";
import { AiFillEyeInvisible, AiOutlineAim } from "react-icons/ai";
import { FaWater } from "react-icons/fa";
import { TowerSpecification } from "../Definitions/TowerSpecifications";
import { HeatSeekingProjectile } from "../GameObjects/Projectiles/HeatSeekingProjectile";
import { Property } from "./property";
import { BoatTower } from "../GameObjects/Towers/BoatTower";
import { HashtagProjectile } from "../GameObjects/Projectiles/HashtagProjectile";
import { PiercingProjectile } from "../GameObjects/Projectiles/PiercingProjectile";
import { SlowingProjectile } from "../GameObjects/Projectiles/SlowingProjectile";
import { FreezerTower } from "../GameObjects/Towers/FreezerTower";

interface TowerCardProps {
  spec: TowerSpecification;
  onClick?(): void;
}

export function TowerCard(props: TowerCardProps) {
  return (
    <div
      key={props.spec.color}
      style={{
        fontSize: "18px",
        lineHeight: "24px",
        background: "white",
        padding: "6px 12px 10px",
        cursor: props.onClick ? "pointer" : undefined,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        position: "relative",
      }}
      onClick={props.onClick}
    >
      {!props.onClick && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            left: 0,
            top: 0,
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{props.spec.name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", lineHeight: "20px" }}>
          {props.spec.prices[0]}
          <GiTwoCoins style={{ marginLeft: "8px" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {props.spec.htmlRender(props.spec.color)}
          <div
            style={{
              marginLeft: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: "2px",
            }}
          >
            {(props.spec.projectileSpec.projectileConstructor === HeatSeekingProjectile ||
              props.spec.projectileSpec.projectileConstructor === HashtagProjectile ||
              props.spec.projectileSpec.projectileConstructor === SlowingProjectile) && (
              <Property value="" icon={<AiOutlineAim style={{ marginRight: "4px" }} />} />
            )}
            {props.spec.towerConstructor === BoatTower && (
              <Property value="" icon={<FaWater style={{ marginRight: "4px" }} />} />
            )}
            {(props.spec.towerConstructor === BoatTower || props.spec.towerConstructor === FreezerTower) && (
              <Property value="" icon={<GiStrikingBalls style={{ marginRight: "4px" }} />} />
            )}
            {props.spec.projectileSpec.slows && (
              <Property value="" icon={<IoMdSnow style={{ marginRight: "4px" }} />} />
            )}
            {props.spec.projectileSpec.projectileConstructor === PiercingProjectile && (
              <Property value="" icon={<GiPiercedBody style={{ marginRight: "4px" }} />} />
            )}
            {props.spec.projectileSpec.projectileConstructor === HashtagProjectile && (
              <Property value="" icon={<AiFillEyeInvisible style={{ marginRight: "4px" }} />} />
            )}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            columnGap: "12px",
            marginTop: "4px",
            rowGap: "4px",
          }}
        >
          <Property
            value={props.spec.projectileSpec.damages[0]}
            icon={<GiBroadsword style={{ marginLeft: "6px" }} />}
          />
          <Property
            value={props.spec.projectileSpec.velocities[0]}
            icon={<GiSupersonicBullet style={{ marginLeft: "6px" }} />}
          />
          <Property value={props.spec.roundsPerMins[0]} icon={<GiBullets style={{ marginLeft: "6px" }} />} />
          <Property value={props.spec.ranges[0]} icon={<GiArcheryTarget style={{ marginLeft: "6px" }} />} />
        </div>
      </div>
    </div>
  );
}
