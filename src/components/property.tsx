interface PropertyProps {
  value: React.ReactNode;
  icon: React.ReactNode;
}

export function Property(props: PropertyProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        lineHeight: "20px",
        whiteSpace: "nowrap",
      }}
    >
      {props.value}
      {props.icon}
    </div>
  );
}
