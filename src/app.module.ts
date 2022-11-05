import { Module, ClassSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformResponseInterceptor } from "./core/http/transform-response-interceptor";
import { DatabaseMotorista } from "./database/database";
import { DatabasePassageiro } from "./database/database";
import { DatabaseViagem } from "./database/database";
import { MotoristaModule } from "./motoristas/motorista.module";
import { PassageiroModule } from "./passageiros/passageiro.module";
import { ViagemModule } from "./viagens/viagem.module";

@Module({
  imports: [MotoristaModule, PassageiroModule, ViagemModule],
  controllers: [],
  providers: [
    DatabaseMotorista,
    DatabasePassageiro,
    DatabaseViagem,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule { }
