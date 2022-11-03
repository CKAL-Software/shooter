import { useContext } from "react";
import { TriggerRenderContext } from "../../lib/contexts";
import { Gun } from "../../Weapons/Gun";
import { Skill } from "./skill";

interface WeaponSkillTreeProps {
  gun: Gun;
}

export function WeaponSkillTree(props: WeaponSkillTreeProps) {
  const rerender = useContext(TriggerRenderContext);

  const skillPointsUsed = props.gun.getSkillPointsUsed().reduce((total, points) => total + points, 0);

  const hasSkillPointsLeft = true;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {props.gun.getSkillSheet().map((gs, i) => {
          const currentNumSkillPoints = props.gun.getSkillPointsUsed()[i];
          const isMaxLevel = currentNumSkillPoints === 3;
          const beforeValue = gs.getEffect(props.gun, isMaxLevel ? currentNumSkillPoints - 1 : currentNumSkillPoints);
          const afterValue = gs.getEffect(props.gun, isMaxLevel ? currentNumSkillPoints : currentNumSkillPoints + 1);
          let text = gs.description.replace("<before>", beforeValue + "").replace("<after>", afterValue + "");
          if (isMaxLevel) {
            text = text.replace("Increase", "Increased").replace("Decrease", "Decreased");
          }

          const isSpecial = i < 3;
          const unavailable = isSpecial
            ? skillPointsUsed < 9
            : i < 6
            ? skillPointsUsed < 6
            : i < 9
            ? skillPointsUsed < 3
            : false;

          const disableCursor =
            !hasSkillPointsLeft ||
            unavailable ||
            (isSpecial ? currentNumSkillPoints === 1 : currentNumSkillPoints === 3);

          return (
            <Skill
              text={text}
              special={isSpecial}
              state={
                unavailable
                  ? "unavailable"
                  : currentNumSkillPoints === 0
                  ? "available"
                  : (isSpecial && currentNumSkillPoints === 1) || currentNumSkillPoints === 3
                  ? "maxed"
                  : currentNumSkillPoints < 3
                  ? "picked"
                  : "bonus"
              }
              currentLevel={currentNumSkillPoints}
              onClick={() => {
                props.gun.upSkill(i);
                rerender();
              }}
              disableCursor={disableCursor}
            >
              {gs.content}
            </Skill>
          );
        })}
      </div>
    </div>
  );
}
