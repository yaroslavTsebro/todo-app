import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';

export function IsNullableDateArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNullableDateArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          const isValidElement = (element: any) =>
              element === null ||
              (element instanceof Date && !isNaN(element.getTime()));

          return value.length === 7 && value.every(isValidElement);
        },
      },
    });
  };
}
