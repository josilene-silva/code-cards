import { z } from 'zod';
import { formMessages } from './messages';

export const validationCollection = z.object({
  name: z
    .string({ required_error: formMessages.required })
    .min(2, { message: formMessages.minSize(2) }),
  description: z
    .string({ required_error: formMessages.required })
    .min(5, { message: formMessages.minSize(5) }),
});

export type SchemaCollection = z.infer<typeof validationCollection>;
