import { PlusOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { GiHeavyBullets, GiSkullCrossedBones, GiSwordWound } from "react-icons/gi";
import { experienceThresholdsNormal, TILE_SIZE } from "../../lib/definitions";
import { percentFormatter, round } from "../../lib/functions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { Gun } from "../../Weapons/Gun";
import { ProgressBar } from "../progressBar";
import { LevelNumber } from "../levelNumber";
import { COLOR_STAT_BONUS_BLUE, COLOR_STAT_BONUS_ORANGE } from "../../lib/definitions.colors";

interface WeaponStatsProps {
  weapon: Gun;
}

export function WeaponStats(props: WeaponStatsProps) {
  const nextLevelBonuses = useMemo(() => props.weapon.getLevelBonusStats(props.weapon.getLevel()), [props.weapon]);

  function getStatText(description: string, stat: WeaponStat, unit: string, converter?: (val: number) => number) {
    const isPercentage = unit === "%";

    const excludePlayerStat = stat === Stat.MagSize || stat === Stat.Projectiles;

    const baseStat = round(props.weapon.getStat(stat, true));
    const nextLevelStat = round(baseStat + nextLevelBonuses[stat]);
    const weaponBonus = props.weapon.getCurrentEffect(stat);
    const playerBonus = excludePlayerStat ? 0 : player.getStat(stat);
    const totalStat = props.weapon.getStat(stat);

    const roundedWeaponBonus = Math.abs(round(weaponBonus.effect));
    const roundedPlayerBonus = Math.abs(round(playerBonus));
    const roundedTotalStat = round(totalStat);

    function convert(val: number) {
      return converter ? converter(val) : val;
    }

    return (stat === Stat.Projectiles && totalStat === 1) || totalStat === 0 ? (
      <></>
    ) : (
      <>
        <div style={{ whiteSpace: "nowrap" }}>{description}</div>
        <div style={{ textAlign: "end" }}>{isPercentage ? baseStat * 100 : convert(baseStat)}</div>
        <div style={{ textAlign: "end", color: "rgba(0,0,0,0.3)" }}>
          {nextLevelBonuses[stat] === 0 ? "" : isPercentage ? nextLevelStat * 100 : convert(nextLevelStat)}
        </div>
        <div>{weaponBonus.effect > 0 ? "+" : weaponBonus.effect < 0 ? "-" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_BLUE }}>
          {!roundedWeaponBonus
            ? ""
            : weaponBonus.isAbsolute
            ? isPercentage
              ? percentFormatter(roundedWeaponBonus, true)
              : convert(roundedWeaponBonus)
            : percentFormatter(roundedWeaponBonus)}
        </div>
        <div>{playerBonus > 0 ? "+" : playerBonus < 0 ? "-" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_ORANGE }}>
          {playerBonus ? percentFormatter(roundedPlayerBonus) : ""}
        </div>
        <div style={{ textAlign: "end" }}>=</div>
        <div style={{ textAlign: "end" }}>{isPercentage ? roundedTotalStat * 100 : convert(roundedTotalStat)}</div>
        <div style={{ marginLeft: -4 }}>{unit}</div>
      </>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: "bold", marginLeft: 0 }}>{props.weapon.getName()}</div>
      <div style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
        <ProgressBar
          percentage={props.weapon.getExperience() / experienceThresholdsNormal[props.weapon.getLevel() + 1]}
          text={props.weapon.getExperience() + "/" + experienceThresholdsNormal[props.weapon.getLevel() + 1]}
          barColor="#90caf9"
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={20}
          width={354}
        />
        <LevelNumber level={props.weapon.getLevel()} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 24, margin: "8px 24px 16px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            columnGap: 8,

            fontSize: 20,
          }}
        >
          <div style={{ textAlign: "end" }}>{props.weapon.getAmmo()}</div>
          <GiHeavyBullets style={{ alignSelf: "center" }} />
          <div style={{ textAlign: "end" }}>{props.weapon.getDamageDealt()}</div>
          <GiSwordWound style={{ alignSelf: "center" }} />
          <div style={{ textAlign: "end" }}>{props.weapon.getTakedowns()}</div>
          <GiSkullCrossedBones style={{ alignSelf: "center" }} />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto repeat(9, min-content)",
          columnGap: 8,
          rowGap: 2,
          width: 380,
          marginRight: 24,
          height: "min-content",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Stat</div>
        <div style={{ textAlign: "end", fontWeight: "bold" }}>Base</div>
        <div style={{ textAlign: "end", fontWeight: "bold" }}>Next</div>
        <div />
        <PlusOutlined
          style={{ alignSelf: "center", justifySelf: "center", color: COLOR_STAT_BONUS_BLUE, fontSize: 20 }}
        />
        <div />
        <PlusOutlined
          style={{ alignSelf: "center", justifySelf: "center", color: COLOR_STAT_BONUS_ORANGE, fontSize: 20 }}
        />
        <div />
        <div style={{ textAlign: "end", fontWeight: "bold" }}>Total</div>
        <div />
        <div style={{ gridColumn: "span 10" }} />
        {getStatText("Ammo cost", Stat.AmmoCost, "$")}
        {getStatText("Damage", Stat.Damage, "")}
        {getStatText("Mag size", Stat.MagSize, "")}
        {getStatText("Reload speed", Stat.ReloadSpeed, "s")}
        {getStatText("Fire rate", Stat.FireRate, "rpm")}
        {getStatText("Velocity", Stat.Velocity, "tiles/s", (v) => round(v / TILE_SIZE))}
        {getStatText("Recoil", Stat.Recoil, "degs")}
        {getStatText("Range", Stat.Range, "tiles", (v) => round(v / TILE_SIZE))}
        {getStatText("Projectiles", Stat.Projectiles, "")}
        {getStatText("Crit chance", Stat.CritChance, "%")}
        {getStatText("Drop chance", Stat.DropChance, "%")}
        {getStatText("Burn", Stat.Burn, "dmg/s")}
      </div>
    </div>
  );
}
