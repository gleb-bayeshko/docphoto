import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Fraction from "fraction.js";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const voidToken = null as unknown as void;

export const layoutPaddings = () =>
  "px-[16px] pb-4 sm:px-[16px] lg:mt-[32px] lg:px-[64px] xl:px-[72px] 2xl:px-[128px]";

export const decimalToFraction = function (d: number) {
  if (d >= 1) {
    return Math.round(d * 10) / 10 + ""; // round to one decimal if value > 1s by multiplying it by 10, rounding, then dividing by 10 again
  }
  let df = 1,
    top = 1,
    bot = 1;
  let tol: any = 1e-8;
  // iterate while value not reached and difference (positive or negative, hence the Math.abs) between value
  // and approximated value greater than given tolerance
  while (df !== d && Math.abs(df - d) > tol) {
    if (df < d) {
      top += 1;
    } else {
      bot += 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      top = parseInt(d * bot, 10);
    }
    df = top / bot;
  }
  if (top > 1) {
    bot = Math.round(bot / top);
    top = 1;
  }
  if (bot <= 1) {
    return "1";
  }
  return top + "/" + bot + "";
};

export const toPlainObject = <T>(obj: T) =>
  JSON.parse(JSON.stringify(obj)) as T;

export const fileToBuffer = (file: File) =>
  new Promise<Buffer>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;
      resolve(Buffer.from(data));
    };
    reader.readAsArrayBuffer(file);
  });

export const uploadFileToS3 = async (
  url: string,
  buffer: Buffer,
  contentType?: string,
) => {
  const resp = await fetch(url, {
    method: "PUT",
    body: buffer,

    ...(contentType
      ? {
          headers: {
            "Content-Type": contentType,
          },
        }
      : {}),
  });
  return resp;
};

export function encrypt(data: string, key: string) {
  return CryptoJS.AES.encrypt(data, key);
}
export function decrypt(data: string, key: string) {
  return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}
