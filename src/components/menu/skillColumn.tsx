import {
  GiAmmoBox,
  GiArrowFlights,
  GiArrowScope,
  GiBlaster,
  GiBullets,
  GiBurningDot,
  GiMachineGunMagazine,
} from "react-icons/gi";
import { Skill } from "./skill";
import { SpecialSkill } from "./specialSkill";

interface SkillColumnProps {
  title: string;
  color: string;
}

export function SkillColumn(props: SkillColumnProps) {
  return (
    <div>
      <div style={{ fontWeight: "bold", fontSize: 20, textAlign: "center", marginBottom: 16 }}>{props.title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SpecialSkill text="Very nice" color={props.color}>
          <GiBurningDot style={{ fontSize: 30 }} />
        </SpecialSkill>
        {/* <Skill text="asd" color={props.color} >
          <GiBlaster style={{ fontSize: 30 }} />
        </Skill>
        <Skill text="asd" color={props.color}>
          <GiMachineGunMagazine style={{ fontSize: 30 }} />
        </Skill>
        <Skill text="asd" color={props.color}>
          <GiBullets style={{ fontSize: 30 }} />
        </Skill>
        <Skill text="asd" color={props.color}>
          <GiAmmoBox style={{ fontSize: 30 }} />
        </Skill>
        <Skill text="asd" color={props.color}>
          <GiArrowFlights style={{ fontSize: 30 }} />
        </Skill>
        <Skill text="asd" color={props.color}>
          <GiArrowScope style={{ fontSize: 30 }} />
        </Skill> */}
      </div>
    </div>
  );
}
