import { z } from 'zod';
import { formMessages } from './messages';

export const validationCard = z.object({
  front: z
    .string({ required_error: formMessages.required })
    .min(5, { message: formMessages.minSize(5) }),
  back: z
    .string({ required_error: formMessages.required })
    .min(5, { message: formMessages.minSize(5) }),
});

export type SchemaCard = z.infer<typeof validationCard>;
