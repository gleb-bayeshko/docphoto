"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCategoryInputSchema } from "~/server/api/schemas/categories";
import {
  Form,
  FormField,
  FormDescription,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { on } from "events";
import { AdminLayout } from "~/components/blocks/admin-layout";

interface IProps {}

const AdminCreateCategory: FC<IProps> = (props) => {
  const { mutateAsync: createCategory } = api.categories.create.useMutation({
    onSuccess() {
      toast.success("Категория создана");
      form.reset();
    },
    onError() {
      toast.error("Ошибка при создании категории");
    },
  });

  const form = useForm<z.infer<typeof createCategoryInputSchema>>({
    resolver: zodResolver(createCategoryInputSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof createCategoryInputSchema>,
  ) => {
    await createCategory(values);
  };

  return (
    <AdminLayout>

    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  type="text"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Уникальный идентификатор</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  type="text"
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button type="submit">Создать</Button>
      </form>
    </Form>
    </AdminLayout>

  );
};

export default AdminCreateCategory;
