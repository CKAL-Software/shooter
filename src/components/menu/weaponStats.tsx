import { PlusOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { COLOR_STAT_BONUS_BLUE, COLOR_STAT_BONUS_ORANGE, experienceThresholdsNormal } from "../../lib/definitions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { player } from "../../Shooter";
import { Gun } from "../../Weapons/Gun";
import { ProgressBar } from "../controlPanelElements/progressBar";
import { GunIcon } from "../gunIcon";

interface WeaponStatsProps {
  weapon: Gun;
}

export function WeaponStats(props: WeaponStatsProps) {
  const nextLevelBonuses = useMemo(() => props.weapon.getLevelBonusStats(props.weapon.getLevel()), [props.weapon]);

  function getStatText(stat: WeaponStat, formatter?: (val: number) => string | number) {
    const baseStat = props.weapon.getStat(stat, true);
    const totalStat = props.weapon.getStat(stat);

    const weaponBonus = props.weapon.getCurrentEffect(stat);
    const playerBonus = player.getStat(stat);

    return (
      <>
        <div style={{ textAlign: "end" }}>{baseStat}</div>
        <div style={{ textAlign: "end", color: "rgba(0,0,0,0.4)" }}>{baseStat + nextLevelBonuses[stat]}</div>
        <div>{weaponBonus ? "+" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_BLUE }}>{weaponBonus || ""}</div>
        <div>{playerBonus ? "+" : ""}</div>
        <div style={{ textAlign: "end", color: COLOR_STAT_BONUS_ORANGE }}>
          {playerBonus ? playerBonus * 100 + "%" : ""}
        </div>
        <div style={{ textAlign: "end" }}>=</div>
        <div style={{ textAlign: "end" }}>{totalStat}</div>
      </>
      // <div style={{ textAlign: "end" }}>
      //   <span>{formatter ? formatter(base) : base}</span>
      //   {getBonusStatText(stat, formatter)}
      //   <span style={{ color: COLOR_STAT_BONUS_BLUE }}>
      //     {base === total ? "" : formatter ? formatter(total) : total}
      //   </span>
      // </div>
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
      <div style={{ gridColumn: "span 9", margin: "4px 0" }}>
        <ProgressBar
          percentage={props.weapon.getExperience() / experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          text={props.weapon.getExperience() + "/" + experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          barColor="#90caf9"
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={20}
          width={260}
        />
      </div>
      <div>Ammo</div>
      <div style={{ textAlign: "end", gridColumn: "span 8", margin: "8px 0" }}>{props.weapon.getAmmo()}</div>
      <div>Stat</div>
      <div>Base</div>
      <div>Next</div>
      <div />
      <PlusOutlined style={{ alignSelf: "center", justifySelf: "center", color: COLOR_STAT_BONUS_BLUE }} />
      <div />
      <PlusOutlined style={{ alignSelf: "center", justifySelf: "center", color: COLOR_STAT_BONUS_ORANGE }} />
      <div />
      <div>Total</div>
      <div style={{ gridColumn: "span 9" }} />
      <div>Damage</div>
      {getStatText(Stat.Damage)}
      <div>Magazine size</div>
      {getStatText(Stat.MagSize)}
      <div>Reload time</div>
      {getStatText(
        Stat.ReloadSpeed,

        (t) => Math.round(t * 100) / 100
      )}
      <div style={{ whiteSpace: "nowrap" }}>Fire rate</div>
      {getStatText(Stat.FireRate)}
      <div>Velocity</div>
      {getStatText(Stat.Velocity)}
      <div>Recoil</div>
      {getStatText(Stat.Recoil)}
      <div>Range</div>
      {getStatText(Stat.Range)}
      <div>Projectiles</div>
      {getStatText(Stat.Projectiles)}
    </>
  );
}
