import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export enum TipoViagem {
  CREATED,
  ACCEPTED,
  REFUSED,
}

export class Viagem {
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @Expose({
    name: "cpf_passageiro",
  })
  cpfPassageiro: string;

  @IsString()
  origem: string;

  @IsString()
  destino: string;

  id: string;
  cpfMotorista: string;
  status: TipoViagem;
}
