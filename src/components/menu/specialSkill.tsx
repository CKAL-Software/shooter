import { Tooltip } from "@mui/material";

interface SpecialSkillProps {
  text: string;
  children: React.ReactNode;
  color: string;
}

export function SpecialSkill(props: SpecialSkillProps) {
  return (
    <Tooltip title={props.text} followCursor>
      <div
        style={{
          height: 50,
          width: 50,
          border: `2px solid ${props.color}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: props.color === "gray" ? "#494747" : "gray",
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  );
}
