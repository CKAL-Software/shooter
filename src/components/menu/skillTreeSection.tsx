import { COLOR_STAT_BONUS_BLUE } from "../../lib/definitions";
import { percentFormatter, round } from "../../lib/functions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { Gun } from "../../Weapons/Gun";
import { SkillTree } from "./skillTree";

interface SkillTreeSectionProps {
  selectedWeapon: Gun;
}

export function SkillTreeSection(props: SkillTreeSectionProps) {
  function getBonusText(description: string, stat: WeaponStat) {
    const { effect, isAbsolute } = props.selectedWeapon.getCurrentEffect(stat);

    const roundedEffect = round(effect);

    return effect ? (
      <>
        <div>{description}</div>
        <div style={{ textAlign: "end" }}>
          {(effect > 0 ? "+" : "") + (isAbsolute ? roundedEffect : percentFormatter(roundedEffect))}
        </div>
      </>
    ) : (
      <div style={{ gridColumn: "span 2" }} />
    );
  }

  return (
    <div style={{ userSelect: "none" }}>
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
      </div>
    </div>
  );
}
