import { Expose } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString, Length } from "class-validator";
import { IsValidAge } from "src/common/decorators/is-valid-age.validator";
import { IsValidCpf } from "src/common/decorators/is-valid-cpf.validator";

export class Passageiro {
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
    toPlainOnly: false,
  })
  dataNascimento: Date;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @IsValidCpf()
  cpf: string;

  @IsString()
  endereco: string;
}
