interface LevelNumberProps {
  level: number;
}

export function LevelNumber(props: LevelNumberProps) {
  return (
    <div style={{ marginLeft: 8, fontWeight: "bold", fontSize: 30, width: 36, textAlign: "center", marginTop: -2 }}>
      {props.level}
    </div>
  );
}
