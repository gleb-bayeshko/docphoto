import React, { FC, ReactNode } from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "~/lib/utils";

interface IProps extends Omit<ButtonProps, "children"> {
  children?: ReactNode;
  icon: ReactNode;
}

export default function IconButton(props: IProps) {
  const { children, className, icon, ...rest } = props;
  return (
    <Button {...rest} className={cn("flex gap-3", className)}>
      {icon}
      {children}
    </Button>
  );
}
