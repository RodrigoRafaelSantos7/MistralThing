import { z } from "zod";

/**
 * Constants
 */
export const MIN_NICKNAME_LENGTH = 0;
export const MAX_NICKNAME_LENGTH = 50;

export const MIN_BIOGRAPHY_LENGTH = 0;
export const MAX_BIOGRAPHY_LENGTH = 500;

export const MIN_INSTRUCTIONS_LENGTH = 0;
export const MAX_INSTRUCTIONS_LENGTH = 1000;

/**
 * Schemas, used in the `SingleFieldForm` component at `/account/preferences`
 */
const nicknameSchema = z.object({
  value: z
    .string()
    .min(MIN_NICKNAME_LENGTH, {
      message: `Nickname must be at least ${MIN_NICKNAME_LENGTH} characters`,
    })
    .max(MAX_NICKNAME_LENGTH, {
      message: `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`,
    }),
});

const biographySchema = z.object({
  value: z
    .string()
    .min(MIN_BIOGRAPHY_LENGTH, {
      message: `Biography must be at least ${MIN_BIOGRAPHY_LENGTH} characters`,
    })
    .max(MAX_BIOGRAPHY_LENGTH, {
      message: `Biography must be at most ${MAX_BIOGRAPHY_LENGTH} characters`,
    }),
});

const instructionsSchema = z.object({
  value: z
    .string()
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at most ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
});

export { nicknameSchema, biographySchema, instructionsSchema };
