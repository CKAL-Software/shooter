import { useContext } from "react";
import { TriggerRenderContext } from "../../lib/contexts";
import { percentFormatter } from "../../lib/functions";
import { Gun } from "../../Weapons/Gun";
import { Skill } from "./skill";

interface SkillTreeProps {
  gun: Gun;
}

export function SkillTree(props: SkillTreeProps) {
  const rerender = useContext(TriggerRenderContext);

  const skillPointsUsed = props.gun.getTotalSkillPointsUsed();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      {Object.values(props.gun.getSkillSheet())
        .sort((a, b) => a.skillTreeIndex - b.skillTreeIndex)
        .map((gs, i) => {
          const isMaxLevel = gs.points === 3;
          let text = "";
          if (!isMaxLevel) {
            const beforeValue = gs.getEffect(gs.points);
            const afterValue = gs.getEffect(gs.points + 1);
            const value = afterValue.effect - beforeValue.effect;
            text = gs.description
              .replace("<value>", afterValue.isAbsolute ? `${value}` : percentFormatter(value))
              .replace("<neg_value>", afterValue.isAbsolute ? `${-value}` : percentFormatter(-value));
          }

          const isSpecial = i < 3;
          const unavailable = isSpecial
            ? skillPointsUsed < 9
            : i < 6
            ? skillPointsUsed < 6
            : i < 9
            ? skillPointsUsed < 3
            : false;

          const isInactive = props.gun.getUnusedSkillPoints() === 0;
          const disableCursor = isInactive || unavailable || (isSpecial ? gs.points === 1 : gs.points === 3);

          return (
            <Skill
              key={gs.stat}
              text={text}
              inactive={isInactive}
              special={isSpecial}
              state={unavailable ? "unavailable" : gs.points === 0 ? "available" : "picked"}
              currentLevel={gs.points}
              onClick={() => {
                props.gun.upgrade(gs.stat);
                rerender();
              }}
              disableCursor={disableCursor}
            >
              {gs.content}
            </Skill>
          );
        })}
    </div>
  );
}
