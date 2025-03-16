import { cache } from "react";
import { getServerAuthSession as getSessionService } from "~/server/auth";

export const getServerAuthSession = cache(async () => getSessionService())