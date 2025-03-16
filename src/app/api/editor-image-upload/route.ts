import { fileTypeFromBuffer } from "file-type";
import { NextRequest } from "next/server";
import { buffer } from "stream/consumers";
import { copyFile, getPresignedUrl } from "~/lib/s3";
import { getServerAuthSession } from "~/lib/session";
import { uploadFileToS3 } from "~/lib/utils";
import { db } from "~/server/db";
import mime from "mime-types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileReader from "filereader";

export const POST = async (req: NextRequest) => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return new Response("UNAUTHORIZED", { status: 401 });
  }
  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });
  const role = user?.role;
  if (role !== "admin") {
    return new Response("FORBIDDEN", { status: 403 });
  }
  const formData = await req.formData();
  const imageField = formData.get("image") as File;

  const reqBuffer = Buffer.from(await imageField.arrayBuffer());

  const result = await fileTypeFromBuffer(reqBuffer);

  if (!result) {
    return new Response(null, { status: 400 });
  }
  const { url, key } = await getPresignedUrl(result.mime, false);
  await uploadFileToS3(url, reqBuffer, result.mime);
  const image = await copyFile(
    key,
    mime.extension(result.mime) as string,
    "article-media",
    5 * 1024 * 1024,
  );
  const imageUrl = image.url;

  return new Response(
    JSON.stringify({
      success: 1,
      file: {
        url: imageUrl,
        name: image.key.split("/").pop(),
        size: reqBuffer.length,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
