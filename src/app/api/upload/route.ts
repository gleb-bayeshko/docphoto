import { uploadFileToS3 } from "~/lib/utils";
import { fileTypeFromBuffer } from "file-type";
import { buffer } from "stream/consumers";
import { NextRequest } from "next/server";

export const PUT = async (req: NextRequest) => {
  const url = new URL(req.url!);
  const uploadUrl = url.searchParams.get("url");
  if (!uploadUrl) {
    return new Response(null, { status: 400 });
  }

  const uploadUrlParsed = new URL(uploadUrl);
  const type = decodeURIComponent(
    uploadUrlParsed.searchParams.get("x-amz-meta-content-type") ?? "",
  );
  if (type === "") {
    return new Response(null, { status: 400 });
  }

  if (!req.body) {
    return new Response(null, { status: 400 });
  }
  const reqBuffer = await buffer(req.body as any);
  const result = await fileTypeFromBuffer(reqBuffer);

  if (!result) {
    return new Response(null, { status: 400 });
  }
  if (result.mime !== type) {
    return new Response(null, { status: 400 });
  }

  return await uploadFileToS3(uploadUrl, reqBuffer, result.mime);
};
