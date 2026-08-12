export const validationMessages = {
  required: 'Este campo es obligatorio.',
  invalidType: 'Tipo de dato inválido.',
  invalidNumber: 'Debe ser un número.',
  positiveNumber: 'Debe ser mayor a 0.',
  integerNumber: 'Debe ser un número entero.',
  nonNegative: 'No puede ser negativo.',
  minLength: (min: number | bigint) => `Este campo requiere al menos ${min} caracteres.`,
  maxLength: (max: number | bigint) => `Este campo puede tener como máximo ${max} caracteres.`,
  minNum: (min: number | bigint) => `El valor mínimo es ${min}.`,
  maxNum: (max: number | bigint) => `El valor máximo es ${max}.`,
  minElementsArray: (min: number | bigint) => `Debe seleccionar por lo menos ${min} elementos.`,
  maxElementsArray: (max: number | bigint) => `Debe seleccionar como máximo ${max} elementos.`,
  invalidEmail: 'Ingresa un email válido.',
  invalidSelection: 'Selecciona una opción válida.',
  invalidRegex: 'Patrón o formato no válido.'
};
