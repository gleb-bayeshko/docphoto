import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { cn } from "~/lib/utils";

type Props = Omit<SkeletonProps, "height" | "width" | "count"> & {
  children?: React.ReactNode;
  isLoaded: boolean;
};
export const Shimmer = (props: Props) => {
  const { children, className, isLoaded, ...rest } = props;
  return (
    <>
      <div className="grid">
        <div
          className={cn(
            "col-start-1 row-start-1 z-[100]",
            isLoaded ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {children}
        </div>
        <div
          className={cn(
            "col-start-1 row-start-1 h-full w-full",
            isLoaded ? "opacity-0" : "",
          )}
        >
          <Skeleton
            {...rest}
            className={cn(
              "h-full w-full leading-[24px_!important] transition-all",
              className,
            )}
          ></Skeleton>
        </div>
      </div>
    </>
  );
};
