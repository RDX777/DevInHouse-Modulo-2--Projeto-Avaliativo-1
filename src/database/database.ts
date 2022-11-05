import { FileHandle, readFile, writeFile } from "fs/promises";
import { Injectable } from "@nestjs/common";
import { Motorista } from "src/motoristas/motorista.entity";
import { PathLike } from "fs";
import { Passageiro } from "src/passageiros/passageiro.entity";
import { Viagem } from "src/viagens/viagem.entity";

class Database {
  fileName: PathLike | FileHandle;
  constructor(fileName: string) {
    this.fileName = fileName;
  }

  public async readAll(): Promise<any[]> {
    const texto = await readFile(this.fileName, "utf-8");
    return JSON.parse(texto);
  }

  public async saveAll(data: Array<any>) {
    const texto = JSON.stringify(data);
    await writeFile(this.fileName, texto);
  }
}

@Injectable()
export class DatabaseMotorista extends Database {
  constructor() {
    super("./src/database/motorista.file.json");
  }

  public async getAllMotoristas(): Promise<Motorista[]> {
    return await this.readAll();
  }

  public async getAllMotoristasStartWith(
    initials: string,
  ): Promise<Motorista[]> {
    const motoristas = await this.readAll();
    const startWithMotorista = motoristas.filter((motorista) => {
      return motorista.nome.toLowerCase().startsWith(initials.toLowerCase());
    });

    return startWithMotorista;
  }

  public async includeMotorista(motorista: Motorista) {
    const motoristas = await this.readAll();
    this.saveAll([...motoristas, motorista]);

    return motorista;
  }

  public async search(cpf: string): Promise<Motorista> {
    const motoristas = await this.readAll();
    return motoristas.find((motorista) => motorista.cpf === cpf);
  }

  public async editMotorista(motorista: Motorista): Promise<Motorista> {
    const motoristas = await this.readAll();
    const newMotorista = motoristas.map((driver) => {
      if (driver.cpf.toLowerCase() === motorista.cpf.toLowerCase()) {
        driver.nome = motorista.nome || driver.nome;
        driver.dataNascimento =
          motorista.dataNascimento || driver.dataNascimento;
        driver.modelo = motorista.modelo || driver.modelo;
        driver.placa = motorista.placa || driver.placa;
        driver.ativo = motorista.ativo || driver.ativo;
      }
      return driver;
    });
    if (newMotorista) {
      this.saveAll(newMotorista);
    }
    return motorista;
  }

  public async blockMotorista(cpf: string, ativo: boolean) {
    const motoristas = await this.readAll();
    const newMotorista = motoristas.map((driver) => {
      if (driver.cpf.toLowerCase() === cpf.toLowerCase()) {
        driver.ativo = ativo["ativo"];
      }
      return driver;
    });
    if (newMotorista) {
      this.saveAll(newMotorista);
      return await this.search(cpf);
    }
  }

  public async deleteMotorista(cpf: string) {
    const motoristas = await this.readAll();
    const newMotoristas = motoristas.filter((motorista) => {
      return motorista.cpf !== cpf;
    });
    this.saveAll(newMotoristas);
  }
}

@Injectable()
export class DatabasePassageiro extends Database {
  constructor() {
    super("./src/database/passageiro.file.json");
  }

  public async getAllPassageiros(): Promise<Passageiro[]> {
    return await this.readAll();
  }

  public async getAllPassageirosStartWith(
    initials: string,
  ): Promise<Passageiro[]> {
    const passageiros = await this.readAll();
    const startWithPassageiro = passageiros.filter((passageiro) => {
      return passageiro.nome
        .toLocaleLowerCase()
        .startsWith(initials.toLocaleLowerCase());
    });

    return startWithPassageiro;
  }

  public async includePassageiro(passageiro: Passageiro) {
    const passageiros = await this.readAll();
    this.saveAll([...passageiros, passageiro]);
    return passageiro;
  }

  public async search(cpf: string): Promise<Passageiro> {
    const passageiros = await this.readAll();
    return passageiros.find((passageiro) => passageiro.cpf === cpf);
  }

  public async editPassageiro(passageiro: Passageiro): Promise<Passageiro> {
    const passageiros = await this.readAll();
    const newPassageiro = passageiros.map((passenger) => {
      if (passenger.cpf.toLowerCase() === passageiro.cpf.toLowerCase()) {
        passenger.nome = passageiro.nome || passenger.nome;
        passenger.dataNascimento =
          passageiro.dataNascimento || passenger.dataNascimento;
        passenger.endereco = passageiro.endereco || passenger.endereco;
      }
      return passenger;
    });
    if (newPassageiro) {
      this.saveAll(newPassageiro);
    }
    return passageiro;
  }

  public async deletePassageiro(cpf: string) {
    const passageiros = await this.readAll();
    const newPassageiro = passageiros.filter((passageiro) => {
      return passageiro.cpf !== cpf;
    });
    this.saveAll(newPassageiro);
  }
}

@Injectable()
export class DatabaseViagem extends Database {
  constructor() {
    super("./src/database/viagem.file.json");
  }

  public async search(id: string): Promise<Viagem> {
    const viagens = await this.readAll();
    return viagens.find((viagem) => viagem.id === id);
  }

  public async includeViagem(viagem: Viagem): Promise<Viagem> {
    const viagens = await this.readAll();
    this.saveAll([...viagens, viagem]);
    return viagem;
  }

  public async getNewViagem(): Promise<Viagem> {
    const viagens = await this.readAll();
    const viagensMotorista = await viagens.find((viagem) => {
      return viagem.cpfMotorista === null;
    });
    return viagensMotorista;
  }

  public async setViagemToMotorista(cpf: string, id: string) {
    const viagens = await this.readAll();
    const newViagem = viagens.map((viagem) => {
      if (viagem.id.toLowerCase() === id.toLowerCase()) {
        viagem.cpfMotorista = cpf;
      }
      return viagem;
    });
    if (newViagem) {
      this.saveAll(newViagem);
    }
  }

  public async searchByMotorista(cpf: string): Promise<Viagem> {
    const viagens = await this.readAll();
    const viagensMotoristas = await viagens.find((viagem) => {
      return viagem.cpfMotorista === cpf;
    });
    return viagensMotoristas;
  }

  public async searchByPassageiro(cpf: string): Promise<Viagem> {
    const viagens = await this.readAll();
    const viagensPassageiros = await viagens.find((viagem) => {
      return viagem.cpfPassageiro === cpf;
    });
    return viagensPassageiros;
  }
}
