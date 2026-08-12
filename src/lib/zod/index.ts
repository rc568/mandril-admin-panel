import * as z from 'zod';
import es from 'zod/v4/locales/es.js';
import { customErrorMap } from './error-map';

z.config(es());
z.config({ customError: customErrorMap });

export { z };
