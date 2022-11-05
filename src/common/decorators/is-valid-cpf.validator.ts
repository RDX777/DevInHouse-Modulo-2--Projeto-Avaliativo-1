import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { cpf } from "cpf-cnpj-validator";

@Injectable()
@ValidatorConstraint()
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return cpf.isValid(value);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "CPF is invalid! Only numbers Ex.: 11111111111";
  }
}

export function IsValidCpf(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCpfConstraint,
    });
  };
}
