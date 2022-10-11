import { CSSProperties } from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  style?: CSSProperties;
  loading?: boolean;
  onHover?(isHovering: boolean): void;
  onClick?(): void;
}

export function Button(props: ButtonProps) {
  return (
    <div
      onMouseEnter={() => props.onHover && props.onHover(true)}
      onMouseLeave={() => props.onHover && props.onHover(false)}
    >
      <button
        onClick={props.onClick}
        style={{
          fontFamily: "Cairo",
          fontSize: "18px",
          padding: "0 16px",
          cursor: props.disabled ? undefined : "pointer",
          ...props.style,
        }}
        disabled={props.disabled}
      >
        {props.loading ? <LoadingOutlined /> : props.children}
      </button>
    </div>
  );
}
