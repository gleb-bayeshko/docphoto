import dayjs from "dayjs";
import { Menu } from "lucide-react";
import React, { FC } from "react";
import { AdminLayout } from "~/components/blocks/admin-layout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

interface IProps {}

const l10n: Record<string, string> = {
  id: "ID",
  username: "@username",
  email: "Email",
  name: "Имя",
  createdAt: "Дата создания",
  emailVerified: "Подтвержден",
  isBanned: "Забанен",
  reasonForBan: "Причина бана",
  siteRole: "Роль",
};

const UsersPage: FC<IProps> = async (props) => {
  const users = await api.users.getUsersCreatedAfter({
    date: dayjs().add(-30, 'd').toDate(),
  });
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(users[0] || {}).map((key) => (
              <TableHead key={key}>{l10n[key] || key}</TableHead>
            ))}
            {/* <TableHead>Действия</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {Object.values(user).map((value, index) => (
                <TableCell key={index}>
                  {value === true
                    ? "Да"
                    : value === false
                      ? "Нет"
                      : value === null
                        ? "Нет"
                        : value instanceof Date
                          ? value?.toLocaleString("ru")
                          : value?.toString()}
                </TableCell>
              ))}
              {/* <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Menu/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Редактировать</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
};

export default UsersPage;
