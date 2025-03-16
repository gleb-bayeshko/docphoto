import Link from "next/link";
import UserLayout from "~/components/blocks/layout";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <UserLayout containerClassName="h-full" contentClassName="h-full">
      <div className="">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-[28px] font-bold">404</h1>
          <p className="mb-8 text-[16px]">Страница не найдена</p>
          <Link href="/">
            <Button> На главную </Button>
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}
