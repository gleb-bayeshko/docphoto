import { z } from "zod";

export const createCategoryInputSchema = z.object({ name: z.string(), slug: z.string() })