import { IsNumberString } from "class-validator";

export class PlayDTO {
  @IsNumberString()
  step!: string;

  @IsNumberString()
  square!: string;
}
