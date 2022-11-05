import { Module } from "@nestjs/common";
import {
  DatabaseMotorista,
  DatabaseViagem,
  DatabasePassageiro,
} from "src/database/database";
import { IsValidCpfConstraint } from "src/common/decorators/is-valid-cpf.validator";
import { ViagemController } from "./viagem.controller";
import { ViagemService } from "./viagem.service";

@Module({
  controllers: [ViagemController],
  providers: [
    ViagemService,
    DatabaseViagem,
    DatabasePassageiro,
    DatabaseMotorista,
    IsValidCpfConstraint,
  ],
})
export class ViagemModule { }
