import * as Minio from "minio";
import { env } from "~/env";
import { db } from "~/server/db";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

const s3 = new Minio.Client({
  endPoint: new URL(env.S3_SERVER_URL).hostname,
  useSSL: true,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
});
export const s3Client = s3;

const bucket = "gallery";
export const s3Bucket = bucket;

export const getObjectStat = async (key: string) => {
  try {
    const obj = await s3.statObject(bucket, key);
    return obj;
  } catch (e) {
    return null;
  }
};

export const downloadFile = async (key: string) => {
  const stream = await s3.getObject(bucket, key);
  return new Promise<Buffer>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _buf = Array<any>();

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream`));
  });
};

export const getFileById = async (id: string) => {
  const file = await db.s3Object.findFirst({
    where: {
      id,
    },
  });
  return file;
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
  const key = `public/${nanoid(24)}.${ext}`;
  await s3.putObject(bucket, key, file);

  const url = `${env.S3_SERVER_URL}/${bucket}/${key}`;

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
    await s3.removeObject(bucket, key);
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
      message: "Файл не найден",
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
    const obj = await s3.statObject(bucket, key);
    if (obj.size && obj.size > maxFileSize) {
      await s3.removeObject(bucket, key);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Файл слишком большой",
      });
    }
    await s3.copyObject(
      bucket,
      newKey,
      `${bucket}/${key}`,
      new Minio.CopyConditions(),
    );

    await s3.removeObject(bucket, key);
    const url = `${env.S3_SERVER_URL}/${bucket}/${newKey}`;
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
      message: "Файл не найден",
    });
  }
};
