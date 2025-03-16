import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "~/env";
import { db } from "~/server/db";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mime from "mime-types";

const s3 = new S3Client({
  endpoint: env.S3_SERVER_URL,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "ru-1",
});
export const s3Client = s3;

const bucket = "91776bb5-2f0fe400-fd50-4c2b-8d23-83d7aa99ee02";
export const s3Bucket = bucket;
export const getFileById = async (id: string) => {
  const file = await db.s3Object.findFirst({
    where: {
      id,
    },
  });
  return file;
};

export const getPresignedUrl = async (
  mimeType: string,
  returnProxiedUrl = true,
) => {
  const key = `temp/${nanoid(24)}.${mime.extension(mimeType)}`;
  const url = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: key,
      ContentType: mimeType,
      Metadata: {
        "Content-Type": mimeType,
      },
    }),
    { expiresIn: 60 * 5 },
  );
  if (returnProxiedUrl) {
    return { url: `/api/upload?url=${encodeURIComponent(url)}`, key };
  }
  return { url, key };
};

export const downloadFile = async (key: string) => {
  const stream = await s3.send(
    new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    }),
  );
  const byteArray = await stream.Body?.transformToByteArray();
  if (!byteArray) throw new Error("Failed to download file");
  return Buffer.from(byteArray.buffer);
};

export const getObjectStat = async (key: string) => {
  const obj = await s3.send(
    new HeadObjectCommand({
      Key: key,
      Bucket: bucket,
    }),
  );
  return obj;
};

export const getFileByKey = async (key: string) => {
  const file = await db.s3Object.findFirst({
    where: {
      key,
    },
  });
  return file;
};

export const createFile = async (file: Buffer, ext: string) => {
  const key = `attachments/${nanoid(24)}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: "public-read",
    }),
  );

  const url = `${env.S3_PUBLIC_URL}/${key}`;

  const dbFile = await db.s3Object.create({
    data: {
      key,
      url,
    },
  });
  return dbFile;
};

export const removeObject = async (key: string) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    const file = await db.s3Object.findFirst({
      where: {
        key,
      },
    });
    if (file) {
      await db.s3Object.delete({
        where: {
          id: file.id,
        },
      });
    }
  } catch (e) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "File not found",
    });
  }
};

export const copyFile = async (
  key: string,
  ext: string,
  cat = "common",
  maxFileSize = 10 * 1024 * 1024,
) => {
  try {
    const newKey = `public/${cat}/${nanoid(24)}.${ext}`;
    const obj = await s3.send(
      new HeadObjectCommand({
        Key: key,
        Bucket: bucket,
      }),
    );
    if (obj.ContentLength && obj.ContentLength > maxFileSize) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "File is too large",
      });
    }

    const resp = await s3.send(
      new CopyObjectCommand({
        Bucket: bucket,
        Key: newKey,
        CopySource: `${bucket}/${key}`,
        ACL: "public-read",
      }),
    );
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    const url = `${env.S3_PUBLIC_URL}/${newKey}`;
    const dbFile = await db.s3Object.create({
      data: {
        key: newKey,
        url,
      },
    });
    return dbFile;
  } catch (e) {
    console.log(e);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "File not found",
    });
  }
};
