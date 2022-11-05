import { IsDateString, IsNotEmpty, IsString, Length } from "class-validator";
import { IsValidAge } from "src/common/decorators/is-valid-age.validator";
import { IsValidCpf } from "src/common/decorators/is-valid-cpf.validator";
import { Exclude, Expose } from "class-transformer";

export class Motorista {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  nome: string;

  @IsDateString({
    message: "Format date: YYYY-MM-DD",
  })
  @IsValidAge(18)
  @Expose({
    name: "data_nascimento",
  })
  dataNascimento: Date;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @IsValidCpf()
  cpf: string;

  @IsString()
  placa: string;

  @IsString()
  modelo: string;

  ativo: boolean;
}
