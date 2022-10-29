import { ReactElement, useMemo } from "react";
import { nTimes } from "../../lib/functions";
import { ProgressBar } from "./progressBar";

interface MagazineProps {
  reloadProgress: number;
  magSize: number;
  magAmmo: number;
}

export function Magazine(props: MagazineProps) {
  const bullets = useMemo(() => {
    const theBullets: ReactElement[] = [];

    let bulletsLeft = props.magSize;

    while (bulletsLeft > 30) {
      bulletsLeft -= 30;
      theBullets.push(...nTimes(30).map((i) => <Bullet key={i} color="#333333" height={30} />));
    }

    theBullets.unshift(...nTimes(bulletsLeft).map((i) => <Bullet key={i} color="#333333" height={30} />));

    if (bulletsLeft - 30 > 0) {
      theBullets.unshift(<div style={{ gridColumn: `span ${30 - bulletsLeft}` }} />);
    }

    return theBullets;
  }, [props.magSize]);

  return (
    <div>
      {props.reloadProgress > 0 ? (
        <ProgressBar
          percentage={props.reloadProgress}
          barColor="#333333"
          backgroundColor="darkgray"
          height={30}
          width={props.magSize * 22 - 2 >= 260 ? 260 : props.magSize * 22 - 2}
          notSmooth
        />
      ) : (
        <div style={{ display: "grid", gap: 2, gridTemplateColumns: `repeat(${(Math.max(props.magSize), 30)},1fr)` }}>
          {bullets}
        </div>
      )}
    </div>
  );
}

function Bullet(props: { color: string; height: number }) {
  return (
    <div
      style={{
        height: props.height,
        width: "100%",
        borderRadius: 4,
        backgroundColor: props.color,
        maxWidth: 20,
      }}
    />
  );
}
