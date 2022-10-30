import { ReactElement, useMemo } from "react";
import { nTimes } from "../../lib/functions";
import { ProgressBar } from "./progressBar";

interface MagazineProps {
  reloadProgress: number;
  magSize: number;
  magAmmo: number;
  reloadTime: number;
}

export function Magazine(props: MagazineProps) {
  const bullets = useMemo(() => {
    const theBullets: ReactElement[] = [];

    const height = props.magSize <= 30 ? 30 : props.magSize <= 60 ? 14 : 9;
    const borderRadius = props.magSize <= 30 ? 4 : props.magSize <= 60 ? 3 : 2;

    let bulletsLeft = props.magSize;
    let magCount = 0;

    while (bulletsLeft > 30) {
      theBullets.unshift(
        // eslint-disable-next-line no-loop-func
        ...nTimes(30).map((i) => (
          <Bullet
            key={i + "," + bulletsLeft}
            color={props.magAmmo >= magCount * 30 + i + 1 ? "#333333" : "darkgray"}
            height={height}
            borderRadius={borderRadius}
          />
        ))
      );
      bulletsLeft -= 30;
      magCount++;
    }

    if (bulletsLeft > 0 && bulletsLeft < 30) {
      theBullets.unshift(<div key="0" style={{ gridColumn: `span ${30 - bulletsLeft}` }} />);
    }

    theBullets.unshift(
      ...nTimes(bulletsLeft).map((i) => (
        <Bullet
          key={i + "," + bulletsLeft}
          color={props.magAmmo >= magCount * 30 + i + 1 ? "#333333" : "darkgray"}
          height={height}
          borderRadius={borderRadius}
        />
      ))
    );

    return theBullets;
  }, [props.magSize, props.magAmmo]);

  return (
    <div>
      {props.reloadProgress > 0 ? (
        <div style={{ marginBottom: props.magSize > 60 ? 9 : undefined }}>
          <ProgressBar
            percentage={props.reloadProgress}
            barColor="#333333"
            backgroundColor="darkgray"
            height={30}
            text={((1 - props.reloadProgress) * props.reloadTime).toFixed(1) + "s"}
            width={260}
            notSmooth
          />
        </div>
      ) : props.magSize < 30 ? (
        <div style={{ display: "flex", columnGap: 2 }}>{bullets}</div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: `repeat(30,1fr)`,
          }}
        >
          {bullets}
        </div>
      )}
    </div>
  );
}

function Bullet(props: { color: string; height: number; borderRadius: number }) {
  return (
    <div
      style={{
        height: props.height,
        width: "100%",
        borderRadius: props.borderRadius,
        backgroundColor: props.color,
        maxWidth: 20,
      }}
    />
  );
}
