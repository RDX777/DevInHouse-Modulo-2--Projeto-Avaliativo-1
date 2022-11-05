import {
  ConflictException,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";

export function notFoundItem() {
  throw new NotFoundException({
    statusCode: HttpStatus.NOT_FOUND,
    message: "Item not found",
  });
}

export function conflictItem(menssage: string) {
  throw new ConflictException({
    statusCode: HttpStatus.CONFLICT,
    message: menssage,
  });
}

export function badRequestItem(menssage: string) {
  throw new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: menssage,
  });
}

export function internalServerErrorItem(menssage: string) {
  throw new InternalServerErrorException({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: menssage,
  });
}
