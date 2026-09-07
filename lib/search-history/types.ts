import { z } from "zod";

export type RecentSearch = {
  username: string;
  searchedAt: string; // ISO date string
};

export const recordSearchSchema = z.object({
  username: z.string().trim().min(1),
});
