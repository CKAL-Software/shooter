import { PlusOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { COLOR_STAT_BONUS_BLUE, COLOR_STAT_BONUS_ORANGE, experienceThresholdsNormal } from "../../lib/definitions";
import { percentFormatter, round } from "../../lib/functions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { Gun } from "../../Weapons/Gun";
import { ProgressBar } from "../controlPanelElements/progressBar";
import { GunIcon } from "../gunIcon";
import { LevelNumber } from "../levelNumber";

interface WeaponStatsProps {
  weapon: Gun;
}

export function WeaponStats(props: WeaponStatsProps) {
  const nextLevelBonuses = useMemo(() => props.weapon.getLevelBonusStats(props.weapon.getLevel()), [props.weapon]);

  function getStatText(description: string, stat: WeaponStat, formatter?: (val: number) => string | number) {
    const excludePlayerStat = stat === Stat.MagSize || stat === Stat.Projectiles;

    const baseStat = props.weapon.getStat(stat, true);
    const weaponBonus = props.weapon.getCurrentEffect(stat);
    const playerBonus = excludePlayerStat ? 0 : player.getStat(stat);
    const totalStat = props.weapon.getFinalStat(stat);

    const roundedWeaponBonus = Math.abs(round(weaponBonus.effect));
    const roundedPlayerBonus = Math.abs(round(playerBonus));
    const roundedTotalStat = round(totalStat);

    return (
      <>
        <div style={{ whiteSpace: "nowrap" }}>{description}</div>
        <div style={{ textAlign: "end" }}>{baseStat}</div>
        <div style={{ textAlign: "end", color: "rgba(0,0,0,0.3)" }}>
          {nextLevelBonuses[stat] === 0 ? "" : baseStat + nextLevelBonuses[stat]}
        </div>
        <div>{weaponBonus.effect > 0 ? "+" : weaponBonus.effect < 0 ? "-" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_BLUE }}>
          {!roundedWeaponBonus
            ? ""
            : weaponBonus.isAbsolute
            ? roundedWeaponBonus
            : percentFormatter(roundedWeaponBonus)}
        </div>
        <div>{playerBonus > 0 ? "+" : playerBonus < 0 ? "-" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_ORANGE }}>
          {playerBonus ? percentFormatter(roundedPlayerBonus) : ""}
        </div>
        <div style={{ textAlign: "end" }}>=</div>
        <div style={{ textAlign: "end" }}>{roundedTotalStat}</div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gridColumn: "span 9", margin: "24px 0 8px" }}>
        <GunIcon
          entityName={props.weapon.getName()}
          level={props.weapon.getLevel()}
          unusedSkillPoints={props.weapon.getUnusedSkillPoints()}
        />
        <div style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>{props.weapon.getName()}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gridColumn: "span 9", margin: "4px 0" }}>
        <ProgressBar
          percentage={props.weapon.getExperience() / experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          text={props.weapon.getExperience() + "/" + experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          barColor="#90caf9"
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={20}
          width={314}
        />
        <LevelNumber level={props.weapon.getLevel()} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "min-content min-content",
          gridColumn: "span 9",
          columnGap: 12,
          rowGap: 2,
          margin: "4px 0 8px",
        }}
      >
        <div>Ammo</div>
        <div style={{ textAlign: "end" }}>{props.weapon.getAmmo()}</div>
        <div style={{ whiteSpace: "nowrap" }}>Damage dealt</div>
        <div style={{ textAlign: "end" }}>{props.weapon.getDamageDealt()}</div>
        <div>Takedowns</div>
        <div style={{ textAlign: "end" }}>{props.weapon.getTakedowns()}</div>
      </div>
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
      <div style={{ gridColumn: "span 9" }} />
      {getStatText("Damage", Stat.Damage)}
      {getStatText("Mag size", Stat.MagSize)}
      {getStatText("Reload speed", Stat.ReloadSpeed, (t) => Math.round(t * 100) / 100)}
      {getStatText("Fire rate", Stat.FireRate)}
      {getStatText("Velocity", Stat.Velocity)}
      {getStatText("Recoil", Stat.Recoil)}
      {getStatText("Range", Stat.Range)}
      {props.weapon.getName() === "Shotgun" && getStatText("Projectiles", Stat.Projectiles)}
    </>
  );
}
