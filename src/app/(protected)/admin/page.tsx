import Link from "next/link";
import React, { FC } from "react";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { Button } from "~/components/ui/button";

interface IProps {}

const AdminDashboard: FC<IProps> = (props) => {
  return (
    <AdminLayout>
      <div></div>
    </AdminLayout>
  );
};

export default AdminDashboard;
