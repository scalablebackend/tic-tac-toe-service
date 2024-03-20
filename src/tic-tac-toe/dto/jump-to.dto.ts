import { IsNumberString } from "class-validator";

export class JumpToDTO {
  @IsNumberString()
  step!: string;
}
