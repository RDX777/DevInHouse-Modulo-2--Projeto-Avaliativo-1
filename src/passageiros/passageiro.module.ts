import { Module } from "@nestjs/common";
import { DatabasePassageiro, DatabaseViagem } from "src/database/database";
import { IsValidAgeConstraint } from "src/common/decorators/is-valid-age.validator";
import { IsValidCpfConstraint } from "src/common/decorators/is-valid-cpf.validator";
import { PassageiroController } from "./passageiro.controller";
import { PassageiroService } from "./passageiro.service";

@Module({
  controllers: [PassageiroController],
  providers: [
    PassageiroService,
    DatabasePassageiro,
    DatabaseViagem,
    IsValidCpfConstraint,
    IsValidAgeConstraint,
  ],
})
export class PassageiroModule { }
