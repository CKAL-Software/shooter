import { BsFillSkipForwardFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiFastForward, HiOutlineFastForward } from "react-icons/hi";
import { gameStats } from "../Shooter";
import { Button } from "./button";
import { GrRefresh } from "react-icons/gr";

interface WaveSectionProps {
  isPaused: boolean;
  isFast: boolean;
  waveNumber: number;
  pauseDisabled: boolean;
  requestForPause: boolean;
  nextWaveDisabled: boolean;
  startNextWave(): void;
}

export function WaveSection(props: WaveSectionProps) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: "8px",
          marginTop: "8px",
        }}
      >
        <Button
          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "30px", width: "100%" }}
          onClick={() => {
            if (props.isPaused) {
              gameStats.isPaused = false;
              gameStats.requestForPause = true;
            } else {
              gameStats.requestForPause = !gameStats.requestForPause;
            }
          }}
        >
          {props.isPaused ? <BsPlayFill /> : props.requestForPause ? <BsPauseFill /> : <GrRefresh />}
        </Button>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "30px",
            width: "100%",
            fontSize: "24px",
          }}
          onClick={() => {
            gameStats.isFast = !gameStats.isFast;
          }}
        >
          {gameStats.isFast ? <HiFastForward /> : <HiOutlineFastForward />}
        </Button>
        <Button
          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "30px", width: "100%" }}
          onClick={props.startNextWave}
          disabled={props.nextWaveDisabled}
        >
          <BsFillSkipForwardFill />
        </Button>
      </div>
    </div>
  );
}
