import { useContext } from "react";
import { Player } from "../../GameObjects/Player";
import { TriggerRenderContext } from "../../lib/contexts";
import { Gun } from "../../Weapons/Gun";
import { Skill } from "./skill";

interface SkillTreeProps {
  entity: Gun | Player;
}

export function SkillTree(props: SkillTreeProps) {
  const rerender = useContext(TriggerRenderContext);

  const skillPointsUsed = props.entity.getTotalSkillPointsUsed();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      {Object.values(props.entity.getSkillSheet())
        .sort((a, b) => a.skillTreeIndex - b.skillTreeIndex)
        .map((gs, i) => {
          const isMaxLevel = gs.points === 3;
          const beforeValue = gs.getEffect(isMaxLevel ? gs.points - 1 : gs.points, props.entity);
          const afterValue = gs.getEffect(isMaxLevel ? gs.points : gs.points + 1, props.entity);
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
            props.entity.getUnusedSkillPoints() === 0 || unavailable || (isSpecial ? gs.points === 1 : gs.points === 3);

          return (
            <Skill
              key={gs.type}
              text={text}
              special={isSpecial}
              state={
                unavailable
                  ? "unavailable"
                  : gs.points === 0
                  ? "available"
                  : (isSpecial && gs.points === 1) || gs.points === 3
                  ? "maxed"
                  : gs.points < 3
                  ? "picked"
                  : "bonus"
              }
              currentLevel={gs.points}
              onClick={() => {
                props.entity.upgrade(gs.type);
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
