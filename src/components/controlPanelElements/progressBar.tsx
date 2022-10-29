interface ProgressBarProps {
  percentage: number;
  width?: number;
  height?: number;
  barColor?: string;
  backgroundColor?: string;
  text?: string;
}

export function ProgressBar(props: ProgressBarProps) {
  const width = props.width || 200;

  return (
    <div style={{ position: "relative", width, borderRadius: 4, overflow: "hidden" }}>
      <div
        style={{
          width: `${width}px`,
          height: `${props.height || 16}px`,
          background: props.backgroundColor || "rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            height: `${props.height || 16}px`,
            width: `${Math.min(width, width * props.percentage)}px`,
            background: props.barColor || "lightgray",
            transition: "1s",
          }}
        />
      </div>
      {props.text && (
        <div
          style={{
            position: "absolute",
            fontSize: 15,
            zIndex: 10,
            left: "50%",
            top: "calc(50% - 1px)",
            transform: "translate(-50%,-50%)",
            color: "white",
          }}
        >
          {props.text}
        </div>
      )}
    </div>
  );
}
