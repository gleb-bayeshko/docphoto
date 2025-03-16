import { notFound } from "next/navigation";
import React, { FC } from "react";
import { toPlainObject } from "~/lib/utils";
import { api } from "~/trpc/server";
import ReportageView from "./reportage-view";

interface IProps {
  params: {
    slug: string;
  };
}

const ReportagePage: FC<IProps> = async (props) => {
  const reportage = await api.posts.getReportage({ slug: props.params.slug });
  if (!reportage) {
    return notFound();
  }
  
  return <ReportageView reportage={toPlainObject(reportage)} />;
};

export default ReportagePage;
