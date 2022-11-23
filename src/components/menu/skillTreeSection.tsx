import { COLOR_STAT_BONUS_BLUE } from "../../lib/definitions";
import { Stat, WeaponStat } from "../../lib/skillDefinitions";
import { Gun } from "../../Weapons/Gun";
import { SkillTree } from "./skillTree";

interface SkillTreeSectionProps {
  selectedWeapon: Gun;
}

export function SkillTreeSection(props: SkillTreeSectionProps) {
  function getBonusText(description: string, stat: WeaponStat) {
    const effect = props.selectedWeapon.getCurrentEffect(stat);

    const roundedEffect = Math.round(effect * 1000) / 1000;

    return effect ? (
      <>
        <div>{description}</div>
        <div style={{ textAlign: "end" }}>{roundedEffect}</div>
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
          marginTop: 16,
          rowGap: 2,
        }}
      >
        {getBonusText("Bonus damage", Stat.Damage)}
        {getBonusText("Reload speed", Stat.ReloadSpeed)}
      </div>
    </div>
  );
}
