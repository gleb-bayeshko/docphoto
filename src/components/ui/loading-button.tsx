import React, { type FC } from "react";
import { Button, type ButtonProps } from "./button";
import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface IProps extends ButtonProps {
  isLoading: boolean;
}

const LoadingButton: FC<IProps> = ({
  isLoading,
  children,
  className,
  ...btnProps
}) => {
  return (
    <Button className={className} disabled={isLoading} {...btnProps}>
      <div className={cn("flex items-center gap-2")}>
        {isLoading && <LoaderCircle className="animate-spin" size={24} />}
        {children}
      </div>
    </Button>
  );
};

export default LoadingButton;
