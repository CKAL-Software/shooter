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
          // width: "max-content",
          gridColumn: "span 2",
          border: `2px solid ${props.color}`,
          borderRadius: 4,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {props.children}
      </div>
    </Tooltip>
  );
}
