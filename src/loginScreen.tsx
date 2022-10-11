import { useEffect, useRef, useState } from "react";
import { GiStoneTower } from "react-icons/gi";
import { Button } from "./components/button";
import { login } from "./lib/authenticationHandler";

interface LoginScreenProps {
  isWorking: boolean;
  onLogin(): Promise<void>;
  setIsWorking(isWorking: boolean): void;
}

export function LoginScreen(props: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isMounted = useRef(true);

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get("email") || "");
    return () => {
      isMounted.current = false;
    };
  }, []);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function tryLogin() {
    try {
      await login(email, password);
      await props.onLogin();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", color: "lightgray" }}>
      <div
        style={{
          fontSize: "60px",
          fontWeight: "bold",
          margin: "200px 0 48px",
          display: "flex",
          alignItems: "center",
        }}
      >
        Tower Defense <GiStoneTower style={{ marginLeft: "24px" }} />
      </div>
      <>
        <div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input
              placeholder="Email..."
              style={{ marginBottom: "24px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordInputRef.current?.select();
                }
              }}
              autoComplete="new-password"
              className="input"
            />
            <input
              placeholder="Password..."
              style={{ marginBottom: "32px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordInputRef}
              type="password"
              className="input"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  props.setIsWorking(true);
                  await tryLogin();
                  props.setIsWorking(false);
                }
              }}
              autoComplete="new-password"
            />
          </div>
        </div>
        <Button
          onClick={async () => {
            try {
              props.setIsWorking(true);
              await tryLogin();
            } catch (error) {
              alert((error as Error).message);
            } finally {
              props.setIsWorking(false);
            }
          }}
          loading={props.isWorking}
          disabled={!email || !password}
          style={{
            margin: "8px 0 36px 0",
          }}
        >
          Login
        </Button>
        <h3
          style={{ margin: 0, cursor: "pointer" }}
          onClick={() =>
            (window.location.href = `https://ckal.dk/sign-up?redirect=${window.location.origin}/tower-defense`)
          }
        >
          Sign up
        </h3>
        <div
          style={{ marginTop: "16px", cursor: "pointer" }}
          onClick={() =>
            (window.location.href = `https://ckal.dk/forgot-password?redirect=${window.location.origin}/tower-defense`)
          }
        >
          Forgot password?
        </div>
      </>
    </div>
  );
}
