import { useContext } from "react";
import { TriggerRenderContext } from "../../lib/contexts";
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
          const beforeValue = gs.getEffect(isMaxLevel ? gs.points - 1 : gs.points);
          const afterValue = gs.getEffect(isMaxLevel ? gs.points : gs.points + 1);
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
