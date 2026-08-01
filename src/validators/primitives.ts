import { z } from '@/lib/zod';

export const emailSchema = z.email({ error: 'Ingresa un email válido.' });

export const priceSchema = z
  .number({ error: 'El precio debe ser un número.' })
  .positive({ error: 'El precio debe ser mayor a 0.' });

export const quantitySchema = z.coerce
  .number({ error: 'La cantidad debe ser un número.' })
  .int({ error: 'La cantidad debe ser un número entero.' })
  .min(0, { error: 'La cantidad no puede ser negativa.' });

export const shortTextSchema = z
  .string()
  .min(3, { error: 'Este campo requiere al menos 3 caracteres.' })
  .max(255, { error: 'Este campo puede tener como máximo 255 caracteres.' });
