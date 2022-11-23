import { useMemo } from "react";
import { COLOR_STAT_BONUS_BLUE, experienceThresholdsNormal } from "../../lib/definitions";
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

    return (
      <>
        <div>{baseStat}</div>
        <div>{baseStat + nextLevelBonuses[stat]}</div>
        <div>{props.weapon.getCurrentEffect(stat)}</div>
        <div>{player.getCurrentMultiplier(stat)}</div>
        <div>{totalStat}</div>
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

  function getBonusStatText(stat: WeaponStat, conversion?: (val: number) => string | number) {
    const effect = props.weapon.getCurrentEffect(stat);
    return effect === 0 ? (
      ""
    ) : (
      <span>
        <span style={{ color: COLOR_STAT_BONUS_BLUE }}>
          {(effect > 0 ? "+" : "") + (conversion ? conversion(effect) : effect)}
        </span>
        =
      </span>
    );
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gridColumn: "span 6", margin: "24px 0 8px" }}>
        <GunIcon
          entityName={props.weapon.getName()}
          level={props.weapon.getLevel()}
          unusedSkillPoints={props.weapon.getUnusedSkillPoints()}
        />
        <div style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>{props.weapon.getName()}</div>
      </div>
      <div style={{ gridColumn: "span 6", margin: "4px 0" }}>
        <ProgressBar
          percentage={props.weapon.getExperience() / experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          text={props.weapon.getExperience() + "/" + experienceThresholdsNormal[props.weapon.getLevel() - 1]}
          barColor="#90caf9"
          backgroundColor={"rgba(0,0,0,0.15)"}
          height={20}
          width={260}
        />
      </div>
      <div style={{ alignSelf: "center" }}>Stat</div>
      <div style={{ alignSelf: "center" }}>Base</div>
      <div style={{ alignSelf: "center" }}>Next</div>
      <div style={{ alignSelf: "center" }}>Weapon bonus</div>
      <div style={{ alignSelf: "center" }}>Player bonus</div>
      <div style={{ alignSelf: "center" }}>Total</div>
      <div style={{ gridColumn: "span 6" }} />
      <div>Ammo</div>
      <div style={{ textAlign: "end", gridColumn: "span 5" }}>{props.weapon.getAmmo()}</div>
      <div style={{ gridColumn: "span 6" }} />
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
