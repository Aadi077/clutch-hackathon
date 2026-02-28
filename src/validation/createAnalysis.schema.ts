/**
 * Zod validation for POST /analyses - Teammate A scope.
 */

import { z } from "zod";

export const createAnalysisSchema = z.object({
  sport: z.string().min(1, "sport is required"),
  league: z.string().optional(),
  season: z.string().optional(),
  player: z.object({
    playerId: z.string().min(1, "player.playerId is required"),
    fullName: z.string().optional(),
    teamIdAtGame: z.string().optional(),
  }),
  game: z.object({
    gameId: z.string().min(1, "game.gameId is required"),
    date: z.string().optional(),
    homeTeamId: z.string().optional(),
    awayTeamId: z.string().optional(),
  }),
  moment: z.object({
    period: z.number().int().min(1, "moment.period must be >= 1"),
    clock: z.string().min(1, "moment.clock is required"),
    timeRemainingSecInPeriod: z.number().optional(),
    timeOffsetAnchor: z
      .object({
        type: z.string(),
        eventId: z.string(),
      })
      .optional(),
    score: z
      .object({
        home: z.number(),
        away: z.number(),
      })
      .optional(),
    scoreDifferential: z.number({
      required_error: "moment.scoreDifferential is required",
    }),
  }),
  params: z
    .object({
      windowBeforeSec: z.number().int().min(0).default(300),
      windowAfterSec: z.number().int().min(0).default(300),
      seriesIntervalSec: z.number().int().min(1).default(5),
      similarLimit: z.number().optional(),
      turningPointThreshold: z.number().optional(),
    })
    .optional()
    .default({}),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
