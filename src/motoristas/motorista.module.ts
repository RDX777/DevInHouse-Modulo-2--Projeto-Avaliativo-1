import { Module } from "@nestjs/common";
import { DatabaseMotorista, DatabaseViagem } from "src/database/database";
import { IsValidAgeConstraint } from "src/common/decorators/is-valid-age.validator";
import { IsValidCpfConstraint } from "src/common/decorators/is-valid-cpf.validator";
import { MotoristaController } from "./Motorista.controller";
import { MotoristaService } from "./Motorista.service";

@Module({
  controllers: [MotoristaController],
  providers: [
    MotoristaService,
    DatabaseMotorista,
    DatabaseViagem,
    IsValidCpfConstraint,
    IsValidAgeConstraint,
  ],
})
export class MotoristaModule { }
