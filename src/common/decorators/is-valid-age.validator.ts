import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as moment from "moment";
import "moment/locale/pt-br";

@Injectable()
@ValidatorConstraint()
export class IsValidAgeConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const ageRaw = moment(value, "YYYY-MM-DD");
    const nowDate = moment();
    const age = nowDate.diff(ageRaw, "year");

    const minAge = validationArguments.constraints[0];
    if (age < minAge) {
      return false;
    }

    return true;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Age is incompatible, more then 18";
  }
}

export function IsValidAge(age: number, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidAge",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [age],
      validator: IsValidAgeConstraint,
    });
  };
}
