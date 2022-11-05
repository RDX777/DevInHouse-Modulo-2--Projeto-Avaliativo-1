import { Injectable } from "@nestjs/common";
import {
  conflictItem,
  notFoundItem,
} from "src/common/http_returns/custom-http-return";
import { DatabaseMotorista, DatabaseViagem } from "src/database/database";
import { Motorista } from "./motorista.entity";

@Injectable()
export class MotoristaService {
  constructor(
    private database: DatabaseMotorista,
    private databaseViagem: DatabaseViagem,
  ) { }

  public async getAllMotoristas(page = "0", size = "10", initials = null) {
    let motoristas;
    if (initials) {
      motoristas = await this.database.getAllMotoristasStartWith(initials);
    } else {
      motoristas = await this.database.getAllMotoristas();
    }

    const pagina = parseInt(page);
    const tamanho = parseInt(size);
    const inicio = pagina * tamanho;
    const fim = inicio + tamanho;

    if (motoristas.length <= tamanho) {
      return motoristas;
    }

    return motoristas.slice(inicio, fim);
  }

  public async search(cpf: string): Promise<Motorista> {
    const motorista = await this.database.search(cpf);
    if (motorista) {
      return motorista;
    }
    notFoundItem();
  }

  public async store(motorista: Motorista): Promise<Motorista> {
    const oldMotorista = await this.database.search(motorista.cpf);
    if (!oldMotorista) {
      motorista.ativo = true;
      return await this.database.includeMotorista(motorista);
    }
    conflictItem("Motorista is already registered");
  }

  public async edit(motorista: Motorista) {
    const oldMotorista = await this.database.search(motorista.cpf);
    if (oldMotorista) {
      return await this.database.editMotorista(motorista);
    }
    notFoundItem();
  }

  public async block(cpf: string, ativo: boolean) {
    const oldMotorista = await this.database.search(cpf);
    if (oldMotorista) {
      return await this.database.blockMotorista(cpf, ativo);
    }
    notFoundItem();
  }

  public async delete(cpf: string) {
    const viagem = await this.databaseViagem.searchByMotorista(cpf);
    if (!viagem) {
      await this.database.deleteMotorista(cpf);
      return true;
    }
    conflictItem("Motorista owns Viagens, cannot be deleted");
  }
}
