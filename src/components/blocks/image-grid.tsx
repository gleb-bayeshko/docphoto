import Image from "next/image";
import React, { FC, ReactNode, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { DirectionAwareHover } from "../ui/direction-aware-hover";
import {
  useDebounceCallback,
  useResizeObserver,
  useWindowSize,
} from "usehooks-ts";
import Link from "next/link";

interface IProps {
  className: string;
  imageWidth?: number;
  images: {
    href?: string;
    id: string;
    src: string;
    width: number;
    height: number;
    children?: ReactNode;
    childrenClassName?: string;
    uploadDate: Date;
  }[];
}

function getAspectRatio(width: number, height: number) {
  const w = width;
  const h = height;

  let aspectRatio;

  if (w > h) {
    aspectRatio = w / h;
  } else {
    aspectRatio = h / w;
  }

  return aspectRatio;
}
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupBy = (property: string) => (array: any[]) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[property];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const ImageGrid: FC<IProps> = ({ className, images, imageWidth }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ width }, setSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const onResize = useDebounceCallback(setSize, 100);

  useResizeObserver({
    ref,
    onResize(size) {
      onResize({ width: size.width ?? 0, height: size.height ?? 0 });
    },
  });

  const colsCount = useMemo(
    () =>
      width > 0
        ? Math.floor(width / (width < 640 ? width / 2 : imageWidth ?? 300))
        : 0,
    [width, imageWidth],
  );

  const imageByCols = useMemo(() => {
    if (colsCount === 0) return [];
    const withCols = images.map((image, i) => {
      return {
        ...image,
        col: i % colsCount,
      };
    });
    type imgType = typeof images;
    return Object.values(groupBy("col")(withCols)) as unknown as imgType[];
  }, [images, colsCount]);

  return (
    <div ref={ref} className={cn("flex w-full gap-3 md:gap-7", className)}>
      {imageByCols.map((col, i) => {
        return (
          <div
            key={i}
            style={{
              width: `${width < 768 ? "w-full" : `${imageWidth}px`}`,
            }}
            className={`flex flex-col gap-3  md:gap-7`}
          >
            {col.map((image, i) => {
              const { width: w, height: h } = calculateAspectRatioFit(
                image.width,
                image.height,
                imageWidth ?? 300,
                10000,
              );
              const { width: mW, height: mH } = calculateAspectRatioFit(
                image.width,
                image.height,
                imageWidth ?? width / 2 - 12,
                10000,
              );
              return (
                <Link
                  href={image.href ?? "#"}
                  key={image.id}
                  className={`group relative`}
                  style={
                    {
                      "--mobile-width": `${mW.toFixed(0)}px`,
                      "--mobile-height": `${mH.toFixed(0)}px`,
                      "--width": `${w.toFixed(0)}px`,
                      "--height": `${h.toFixed(0)}px`,
                    } as React.CSSProperties
                  }
                >
                  <DirectionAwareHover
                    className={`h-[var(--mobile-height)] w-[var(--mobile-width)] md:h-[var(--height)] md:w-[var(--width)]`}
                    image={
                      <Image
                        className={`scale-[1.2] object-cover`}
                        alt={"User uploaded image"}
                        src={image.src}
                        width={w}
                        height={h}
                      />
                    }
                  >
                    {image.children}
                  </DirectionAwareHover>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;
/*'
{images
      */
