import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
});