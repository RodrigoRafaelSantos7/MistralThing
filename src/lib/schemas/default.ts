import { z } from "zod";

/**
 * Constants
 */
const MIN_VALUE_LENGTH = 1;
const MAX_VALUE_LENGTH = 32;

/**
 * Schema, used in the `SingleFieldForm` as fallback schema if no schema is provided
 */
export const defaultSingleFieldSchema = z.object({
  value: z
    .string()
    .min(MIN_VALUE_LENGTH, {
      message: `Value must be at least ${MIN_VALUE_LENGTH} characters`,
    })
    .max(MAX_VALUE_LENGTH, {
      message: `Value must be at most ${MAX_VALUE_LENGTH} characters`,
    }),
});
