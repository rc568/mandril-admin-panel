import * as z from 'zod';
import es from 'zod/v4/locales/es.js';

z.config(es());
z.config({
  customError: (iss) => {
    if (iss.code === 'invalid_type') {
      if (iss.input === undefined) return 'Seleccione una opción válida.';

      return 'Tipo de dato inválido.';
    }

    if (iss.code === 'too_small') {
      if (typeof iss.input === 'number') {
        return `El mínimo valor posible es ${iss.minimum}.`;
      }
      if (typeof iss.input === 'string') {
        return `Este campo requiere al menos ${iss.minimum} caracteres.`;
      }
    }

    if (iss.code === 'too_big') {
      if (typeof iss.input === 'number') {
        return `El máximo valor posible es ${iss.maximum}.`;
      }
      if (typeof iss.input === 'string') {
        return `Este campo no puede exceder de ${iss.maximum} caracteres.`;
      }
    }

    return undefined;
  }
});

export { z };
