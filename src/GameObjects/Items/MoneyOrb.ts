import { Point } from "../../lib/definitions";
import { COLOR_MONEY } from "../../lib/definitions.colors";
import { player } from "../../Shooter";
import { Orb } from "./Orb";

export class MoneyOrb extends Orb {
  private money: number;

  constructor(position: Point, money: number) {
    super(position, 8, COLOR_MONEY);

    this.money = money;
  }

  onPickup(): void {
    player.changeMoney(this.money);
    player.setTint(237, 213, 0);
  }
}
