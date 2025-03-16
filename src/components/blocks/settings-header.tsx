"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";

interface IProps {
  canViewEquipment?: boolean;
}

const urls = [
  { name: "Профиль", url: "/settings" },
  { name: "Оборудование", url: "/settings/equipment" },
];

const SettingsHeader = ({ canViewEquipment }: IProps) => {
  const pathname = usePathname();
  const activeUrl = urls.find(({ url }) => pathname === url);
  canViewEquipment =
    typeof canViewEquipment === "undefined" ? true : canViewEquipment;
  return (
    <div className="flex items-end gap-4">
      {urls.map(({ name, url }) => (
        <Link
          key={url}
          onClick={() => {
            if (url === "/settings/equipment" && !canViewEquipment) {
                toast.error("Доступ к вкладке оборудование имеют только пользователи с ролью Фотограф")
            }
          }}
          href={url === "/settings/equipment" && !canViewEquipment ? "#" : url}
        >
          <div
            className={cn(
              activeUrl!.url === url
                ? "text-2xl font-bold text-primary"
                : "text-xl font-medium",
              url === "/settings/equipment" &&
                !canViewEquipment &&
                "pointer-events-none text-gray-400",
            )}
          >
            {name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SettingsHeader;
