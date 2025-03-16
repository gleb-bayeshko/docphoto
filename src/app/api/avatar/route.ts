import { NextRequest } from "next/server";
import path from "path";
import { downloadFile } from "~/lib/s3";
import { getServerAuthSession } from "~/lib/session";
import { api } from "~/trpc/server";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const cacheHeader = {
    "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate, no-store",
  };
  try {
    const session = await api.auth.getFullUser();
    if (!session.avatarUrl)
      return new Response(null, { status: 404, headers: cacheHeader });
    const buffer = await downloadFile(
      "public/avatars/" + path.basename(session.avatarUrl),
    );
    return new Response(buffer, {
      headers: {
        ...cacheHeader,
        "Content-Type": "image/jpeg",
      },
    });
  } catch (e) {
    return new Response(null, { status: 404, headers: cacheHeader });
  }
};
