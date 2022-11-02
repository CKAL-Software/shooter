import { Tooltip } from "@mui/material";

interface SkillProps {
  text: string;
  color: string;
  children: React.ReactNode;
}

export function Skill(props: SkillProps) {
  return (
    <Tooltip title={props.text} placement="top" followCursor>
      <div
        style={{
          border: `2px solid ${props.color}`,
          borderRadius: 4,
          height: 40,
          width: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  );
}
