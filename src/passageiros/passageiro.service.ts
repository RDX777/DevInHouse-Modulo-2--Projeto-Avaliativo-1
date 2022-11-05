import { Injectable } from "@nestjs/common";
import { DatabasePassageiro, DatabaseViagem } from "src/database/database";
import { Passageiro } from "./passageiro.entity";
import {
  conflictItem,
  notFoundItem,
} from "src/common/http_returns/custom-http-return";

@Injectable()
export class PassageiroService {
  constructor(
    private database: DatabasePassageiro,
    private databaseViagem: DatabaseViagem,
  ) { }

  public async getAllPassageiros(page = "0", size = "10", initials = null) {
    let passageiros;
    if (initials) {
      passageiros = await this.database.getAllPassageirosStartWith(initials);
    } else {
      passageiros = await this.database.getAllPassageiros();
    }

    const pagina = parseInt(page);
    const tamanho = parseInt(size);
    const inicio = pagina * tamanho;
    const fim = inicio + tamanho;

    if (passageiros.length <= tamanho) {
      return passageiros;
    }

    return passageiros.slice(inicio, fim);
  }

  public async search(cpf: string): Promise<Passageiro> {
    const passageiro = await this.database.search(cpf);
    if (passageiro) {
      return passageiro;
    }
    notFoundItem();
  }

  public async store(passageiro: Passageiro): Promise<Passageiro> {
    const oldPassageiro = await this.database.search(passageiro.cpf);
    if (!oldPassageiro) {
      return await this.database.includePassageiro(passageiro);
    }
    conflictItem("Passageiro already registered");
  }

  public async edit(passageiro: Passageiro) {
    const oldPassageiro = await this.search(passageiro.cpf);
    if (oldPassageiro) {
      return await this.database.editPassageiro(passageiro);
    }
    notFoundItem();
  }

  public async delete(cpf: string) {
    const viagem = await this.databaseViagem.searchByPassageiro(cpf);
    if (!viagem) {
      await this.database.deletePassageiro(cpf);
      return true;
    }
    conflictItem("Passageiro owns Viagens, cannot be deleted");
  }
}
