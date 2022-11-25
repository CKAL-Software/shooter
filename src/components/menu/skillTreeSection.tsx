import { COLOR_STAT_BONUS_BLUE } from "../../lib/definitions";
import { percentFormatter, round } from "../../lib/functions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { Gun } from "../../Weapons/Gun";
import { SkillTree } from "./skillTree";

interface SkillTreeSectionProps {
  selectedWeapon: Gun;
}

export function SkillTreeSection(props: SkillTreeSectionProps) {
  function getBonusText(description: string, stat: WeaponStat, isPercentagePoints?: boolean) {
    const { effect, isAbsolute } = props.selectedWeapon.getCurrentEffect(stat);

    const roundedEffect = round(effect);

    return effect ? (
      <>
        <div>{description}</div>
        <div style={{ textAlign: "end" }}>
          {(effect > 0 ? "+" : "") +
            (isAbsolute
              ? isPercentagePoints
                ? percentFormatter(roundedEffect, true)
                : roundedEffect
              : percentFormatter(roundedEffect))}
        </div>
      </>
    ) : (
      <></>
    );
  }

  return (
    <div style={{ userSelect: "none", width: 220 }}>
      <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Skill tree</div>
      <SkillTree gun={props.selectedWeapon} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto min-content",
          color: COLOR_STAT_BONUS_BLUE,
          marginTop: 24,
          rowGap: 2,
        }}
      >
        {getBonusText("Damage bonus", Stat.Damage)}
        {getBonusText("Reload speed bonus", Stat.ReloadSpeed)}
        {getBonusText("Magazine size increase", Stat.MagSize)}
        {getBonusText("Fire rate bonus", Stat.FireRate)}
        {getBonusText("Recoil decrease", Stat.Recoil)}
        {getBonusText("Range bonus", Stat.Range)}
        {getBonusText("Crit chance bonus", Stat.CritChance, true)}
        {getBonusText("Ammo cost", Stat.AmmoCost)}
        {getBonusText("Drop chance bonus", Stat.DropChance)}
        {getBonusText("Extra projectiles", Stat.Projectiles)}
        {getBonusText("Burn damage", Stat.Burn)}
        {getBonusText("Penetration", Stat.Penetration)}
      </div>
    </div>
  );
}
