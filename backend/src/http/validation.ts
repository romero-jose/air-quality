import type { z } from "zod";

export const formatZodError = (error: z.ZodError) => ({
  error: "Invalid request",
  issues: error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  })),
});
