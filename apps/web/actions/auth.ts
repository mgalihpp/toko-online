"use server";

import { getBaseUrl } from "@repo/ui/lib/utils";
import type { NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

export const getSessionForMiddleware = async (req: NextRequest) => {
  const res = await fetch(`${getBaseUrl()}/api/auth/get-session`, {
    headers: {
      cookie: req.headers.get("cookie") || "", // Forward the cookies from the request
    },
  });

  const data = (await res.json()) as Session;

  return {
    session: data?.session,
    user: data?.user,
  };
};
