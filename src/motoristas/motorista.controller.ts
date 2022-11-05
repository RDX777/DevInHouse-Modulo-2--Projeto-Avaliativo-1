import {
  Body,
  Query,
  Param,
  Controller,
  Post,
  Get,
  Patch,
  Put,
  Delete,
  HttpStatus,
} from "@nestjs/common";
import { internalServerErrorItem } from "src/common/http_returns/custom-http-return";

import { NestResponse } from "src/core/http/nest-response";
import { NestResponseBuilder } from "src/core/http/nest-response-builder";
import { Motorista } from "./motorista.entity";
import { MotoristaService } from "./Motorista.service";

@Controller("motoristas")
export class MotoristaController {
  constructor(private service: MotoristaService) { }

  @Get()
  public async getAllMotoristas(
    @Query("page") page: string,
    @Query("size") size: string,
    @Query("initials") initials: string,
  ) {
    const motoristas = await this.service.getAllMotoristas(
      page,
      size,
      initials,
    );
    if (motoristas) {
      return motoristas;
    }
    internalServerErrorItem("Internal server errorsss");
  }

  @Get(":cpf")
  public async search(@Param("cpf") cpf: string): Promise<Motorista> {
    const motorista = await this.service.search(cpf);
    if (motorista) {
      return motorista;
    }
    internalServerErrorItem("Internal server error");
  }

  @Post()
  public async store(@Body() motorista: Motorista): Promise<NestResponse> {
    const newMotorista = await this.service.store(motorista);
    if (newMotorista) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `/motoristas/${newMotorista.cpf}` })
        .withBody(newMotorista)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Patch()
  public async edit(@Body() motorista: Motorista) {
    const newMotorista = await this.service.edit(motorista);
    if (newMotorista) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `/motoristas/${newMotorista.cpf}` })
        .withBody(newMotorista)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Put(":cpf")
  public async block(@Param("cpf") cpf: string, @Body() ativo: boolean) {
    const statusMotorista = await this.service.block(cpf, ativo);
    if (statusMotorista) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `/motoristas/${statusMotorista.cpf}` })
        .withBody(statusMotorista)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Delete(":cpf")
  public async delete(@Param("cpf") cpf: string): Promise<NestResponse> {
    const motorista = await this.service.delete(cpf);
    if (motorista) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.NO_CONTENT)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }
}
