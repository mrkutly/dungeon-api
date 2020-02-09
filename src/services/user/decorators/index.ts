/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationOptions } from "class-validator";

export function IsSecurePassword() {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: "isSecurePassword",
      target: object.constructor,
      propertyName: propertyName,
      options: ({
        message: "Password must be at least 8 characters long and contain at least 1 number and 1 special character (!@#$%^&*)."
      } as ValidationOptions),
      validator: {
        validate(value: string): boolean {
          const isString = typeof value === "string";
          const isLongEnough = value.length > 7;
          const containsOneSpecialChar = Boolean(value.match(/.*[!@#\$%\^&\*].*/g));
          const containsOneNumber = Boolean(value.match(/.*[0-9].*/g));

          return isString && isLongEnough && containsOneSpecialChar && containsOneNumber;
        }
      }
    });
  };
}