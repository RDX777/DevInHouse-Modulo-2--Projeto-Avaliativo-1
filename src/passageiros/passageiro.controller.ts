import {
  Body,
  Query,
  Param,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  HttpStatus,
} from "@nestjs/common";

import { NestResponse } from "src/core/http/nest-response";
import { NestResponseBuilder } from "src/core/http/nest-response-builder";
import { Passageiro } from "./passageiro.entity";
import { PassageiroService } from "./passageiro.service";

import { internalServerErrorItem } from "../common/http_returns/custom-http-return";

@Controller("passageiros")
export class PassageiroController {
  constructor(private service: PassageiroService) { }

  @Get()
  public async getAllPassageiros(
    @Query("page") page: string,
    @Query("size") size: string,
    @Query("initials") initials: string,
  ): Promise<NestResponse> {
    const passageiros = await this.service.getAllPassageiros(
      page,
      size,
      initials,
    );
    if (passageiros) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `/passageiros` })
        .withBody(passageiros)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Get(":cpf")
  public async search(@Param("cpf") cpf: string): Promise<NestResponse> {
    const passageiro = await this.service.search(cpf);
    if (passageiro) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `/passageiros${passageiro.cpf}` })
        .withBody(passageiro)
        .build();
    }

    internalServerErrorItem("Internal server error");
  }

  @Post()
  public async store(@Body() passageiro: Passageiro): Promise<NestResponse> {
    const newPassageiro = await this.service.store(passageiro);
    if (newPassageiro) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `/passageiros/${newPassageiro.cpf}` })
        .withBody(newPassageiro)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Patch()
  public async edit(@Body() passageiro: Passageiro) {
    const newPassageiro = await this.service.edit(passageiro);
    if (newPassageiro) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `/passageiros/${newPassageiro.cpf}` })
        .withBody(newPassageiro)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Delete(":cpf")
  public async delete(@Param("cpf") cpf: string): Promise<NestResponse> {
    await this.service.delete(cpf);
    return new NestResponseBuilder().withStatus(HttpStatus.NO_CONTENT).build();
  }
}
