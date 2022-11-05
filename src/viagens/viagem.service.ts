import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import {
  DatabaseViagem,
  DatabasePassageiro,
  DatabaseMotorista,
} from "src/database/database";
import { TipoViagem, Viagem } from "./Viagem.entity";
import {
  badRequestItem,
  notFoundItem,
} from "src/common/http_returns/custom-http-return";

@Injectable()
export class ViagemService {
  constructor(
    private database: DatabaseViagem,
    private databasePassageiro: DatabasePassageiro,
    private databaseMotorista: DatabaseMotorista,
  ) { }

  public async store(viagem: Viagem): Promise<Viagem> {
    const passageiro = await this.databasePassageiro.search(
      viagem.cpfPassageiro,
    );
    if (passageiro) {
      viagem.id = uuidv4();
      viagem.cpfMotorista = null;
      viagem.status = TipoViagem.CREATED;
      return await this.database.includeViagem(viagem);
    }
    badRequestItem("Passageiro must be registered");
  }

  public async getViagemToMotorista(): Promise<Viagem> {
    const newViagem = await this.database.getNewViagem();
    if (newViagem) {
      return newViagem;
    }
    notFoundItem();
  }

  public async setViagemToMotorista(cpf: string, id: string): Promise<Viagem> {
    const motorista = await this.databaseMotorista.search(cpf);
    if (motorista) {
      const viagem = await this.database.search(id);
      if (viagem) {
        await this.database.setViagemToMotorista(cpf, id);
        return viagem;
      }
      notFoundItem();
    }
    badRequestItem("Motorista must be registered");
  }
}
