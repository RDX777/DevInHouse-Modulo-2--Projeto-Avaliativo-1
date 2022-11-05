import { Body, Controller, Post, Get, Param, HttpStatus } from "@nestjs/common";
import { NestResponse } from "src/core/http/nest-response";
import { NestResponseBuilder } from "src/core/http/nest-response-builder";
import { Viagem } from "./viagem.entity";
import { ViagemService } from "./viagem.service";
import {
  notFoundItem,
  conflictItem,
  internalServerErrorItem,
} from "../common/http_returns/custom-http-return";
import { badRequestItem } from "../common/http_returns/custom-http-return";

@Controller("viagens")
export class ViagemController {
  constructor(private service: ViagemService) { }

  @Post()
  public async store(@Body() viagem: Viagem): Promise<NestResponse> {
    const newViagem = await this.service.store(viagem);
    if (newViagem) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `/viagens/${newViagem.id}` })
        .withBody(newViagem)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Post("/motorista/:cpf")
  public async setViagemToMotorista(
    @Param("cpf") cpf: string,
    @Body() id: string,
  ): Promise<NestResponse> {
    const viagem = await this.service.setViagemToMotorista(cpf, id["id"]);
    if (viagem) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `/viagens/${id["id"]}` })
        .withBody(viagem)
        .build();
    }
    internalServerErrorItem("Internal server error");
  }

  @Get("/motorista")
  public async getViagemToMotorista(): Promise<Viagem> {
    const idViagem = await this.service.getViagemToMotorista();
    if (idViagem) {
      return idViagem;
    }
    internalServerErrorItem("Internal server error");
  }
}
