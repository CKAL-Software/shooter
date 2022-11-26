interface HeaderProps {
  children: React.ReactNode;
}

export function Header(props: HeaderProps) {
  return <div style={{ fontSize: 24, marginBottom: 8, fontWeight: "bold", textAlign: "center" }}>{props.children}</div>;
}
