import { COLOR_STAT_BONUS_BLUE, experienceThresholdsNormal, TICK_DURATION_S } from "../../lib/definitions";
import { SkillType } from "../../lib/skillDefinitions";
import { Gun } from "../../Weapons/Gun";
import { ProgressBar } from "../controlPanelElements/progressBar";
import { GunIcon } from "../gunIcon";

interface WeaponStatsProps {
  weapon: Gun;
}

export function WeaponStats(props: WeaponStatsProps) {
  function getStatText(stat: SkillType, base: number, total: number, formatter?: (val: number) => string | number) {
    return (
      <div style={{ textAlign: "end" }}>
        <span>{formatter ? formatter(base) : base}</span>
        {getBonusStatText(stat, formatter)}
        <span style={{ color: COLOR_STAT_BONUS_BLUE }}>
          {base === total ? "" : formatter ? formatter(total) : total}
        </span>
      </div>
    );
  }

  function getBonusStatText(stat: SkillType, conversion?: (val: number) => string | number) {
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
      <div style={{ display: "flex", alignItems: "center", gridColumn: "span 2", margin: "24px 0 8px" }}>
        <GunIcon
          gunName={props.weapon.getName()}
          level={props.weapon.getLevel()}
          unusedSkillPoints={props.weapon.getUnusedSkillPoints()}
        />
        <div style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>{props.weapon.getName()}</div>
      </div>
      <div style={{ gridColumn: "span 2", margin: "4px 0" }}>
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
      <div style={{ textAlign: "end" }}>{props.weapon.getAmmo()}</div>
      <div>Damage</div>
      {getStatText("damage", props.weapon.getDamage(true), props.weapon.getDamage())}
      <div>Magazine size</div>
      {getStatText("magSize", props.weapon.getMagazineSize(true), props.weapon.getMagazineSize())}
      <div>Reload time</div>
      {getStatText(
        "reloadSpeed",
        props.weapon.getReloadTime(true),
        props.weapon.getReloadTime(),
        (t) => Math.round(t * 100) / 100
      )}
      <div style={{ whiteSpace: "nowrap" }}>Fire rate</div>
      {getStatText("fireRate", props.weapon.getFireRate(true), props.weapon.getFireRate())}
      <div>Velocity</div>
      {getStatText("velocity", props.weapon.getVelocity(true), props.weapon.getVelocity(), (v) => v / TICK_DURATION_S)}
      <div>Recoil</div>
      {getStatText("recoil", props.weapon.getRecoil(true), props.weapon.getRecoil())}
      <div>Range</div>
      {getStatText("range", props.weapon.getRange(true), props.weapon.getRange())}
      <div>Projectiles</div>
      {getStatText("multiShot", props.weapon.getNumBullets(true), props.weapon.getNumBullets())}
    </>
  );
}
