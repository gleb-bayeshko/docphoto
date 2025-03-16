"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import React, { FC, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import UserLayout from "~/components/blocks/layout";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/ui/icon-button";
import { Spinner } from "~/components/ui/spinner";
import {
  cn,
  decimalToFraction,
  fileToBuffer,
  uploadFileToS3,
  voidToken,
} from "~/lib/utils";
import { createContentInputSchema } from "~/server/api/schemas/posts";
import { api } from "~/trpc/react";
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
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Shimmer } from "~/components/ui/shimmer";
import { useDropzone } from "react-dropzone";
import Link from "next/link";

interface IProps {}
const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const UploadPage: FC<IProps> = (props) => {
  const { data: user } = api.auth.getFullUser.useQuery();

  const [file, setFile] = React.useState<File | null>(null);
  const [src, setSrc] = React.useState<string | null>(null);
  const { data: categories } = api.categories.getAll.useQuery(voidToken, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: createPost, isPending: isCreationPending } =
    api.posts.create.useMutation();
  const { mutateAsync: createPresignedUrls, isPending: isUrlsPending } =
    api.uploads.createPresignedUrls.useMutation();
  const { mutateAsync: parseExif, isPending: isParsePending } =
    api.posts.parseExif.useMutation({
      onError(error, variables, context) {
        setIsExifParsing(false);
      },
    });
  const [isExifParsing, setIsExifParsing] = React.useState(false);
  const isCreating = false;

  const defaultValues = {
    title: "",
    description: "",
    imageKey: "",
    categoryId: "none",
    albumId: undefined,
    tags: [],
    cameraId: undefined,
    lensId: undefined,
    createDate: undefined,
    iso: undefined,
    focusLength: undefined,
    aperture: undefined,
    exposureTime: undefined,
  };
  const form = useForm<z.infer<typeof createContentInputSchema>>({
    resolver: zodResolver(createContentInputSchema),
    defaultValues,
  });

  React.useEffect(() => {
    const input = document.querySelector("#filePicker") as
      | HTMLInputElement
      | undefined;
    if (input) {
      input.value = "";
    }
    if (file) {
      toBase64(file).then((res) => {
        setTimeout(() => {
          setSrc(res as string);
        }, 300);
      });
      (async () => {
        setIsExifParsing(true);
        const url = await createPresignedUrls({ contentType: file.type });
        await uploadFileToS3(url.url, await fileToBuffer(file));
        const data = await parseExif({ key: url.key });
        console.log(data);
        const typedData = data as {
          ISO?: number;
          ExposureTime?: number;
          ApertureValue?: number;
          FocalLength?: number;
          CreateDate?: Date;
          Model?: string;
        };
        const fixed = typedData.ExposureTime;
        form.setValue("iso", typedData.ISO);
        form.setValue("exposureTime", fixed);
        form.setValue("camera", typedData.Model);
        if (fixed) {
          setUserExposureTime(decimalToFraction(fixed));
        }
        form.setValue(
          "aperture",
          typedData.ApertureValue
            ? Math.round(typedData.ApertureValue)
            : undefined,
        );
        form.setValue(
          "focusLength",
          typedData.FocalLength ? Math.round(typedData.FocalLength) : undefined,
        );
        form.setValue("createDate", typedData.CreateDate);

        setIsExifParsing(false);
      })();
    } else {
      setSrc(null);
      form.reset(defaultValues);
    }
  }, [file]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const onSubmit = async (data: z.infer<typeof createContentInputSchema>) => {
    if (!file) {
      return;
    }
    setIsSubmitting(true);
    const url = await createPresignedUrls({ contentType: file.type });
    await uploadFileToS3(url.url, await fileToBuffer(file));
    const imageKey = url.key;
    const res = await createPost({ ...data, imageKey });
    if (res) {
      toast.success("Фото успешно загружено");
      setFile(null);
      form.reset(defaultValues);
    }
    setIsSubmitting(false);
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (acceptedFiles[0]) {
        setFile(acceptedFiles[0]);
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [userExposureTime, setUserExposureTime] = React.useState<string>("");

  return (
    <UserLayout>
      <Shimmer className="rounded-xl" isLoaded={!!user}>
        {user?.siteRole === "viewer" && (
          <div className="flex h-[400px] flex-col items-center justify-center">
            <h1 className="mb-4 text-[32px] font-bold">
              Загрузка фото доступна только фотографам
            </h1>
            <Link href="/settings/equipment">
              <Button className="mt-4">Стать фотографом</Button>
            </Link>
          </div>
        )}
        {user?.siteRole === "photopgrapher" && (
          <div>
            <h1 className="mb-4 text-[32px] font-bold">Загрузить свое фото</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div
                  className={cn(
                    "relative flex h-[400px] flex-col rounded-lg p-[1px] lg:shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]",
                    !file && !src ? "" : "border",
                  )}
                >
                  {file && src && !isCreationPending && (
                    <div className="absolute right-0 ml-auto mt-2  cursor-pointer pr-2">
                      <X
                        className="text-black mix-blend-difference invert"
                        onClick={() => setFile(null)}
                      />
                    </div>
                  )}
                  {isExifParsing && (
                    <div className="absolute left-[12px] ml-auto mt-2 flex cursor-pointer rounded-sm bg-white/30 p-2  pl-2 backdrop-blur-md">
                      <Spinner />
                      <span className="ml-2">Получение информации о файле</span>
                    </div>
                  )}

                  {file && (
                    <>
                      {!src && (
                        <div className="m-auto">
                          <Spinner />
                        </div>
                      )}
                      {src && (
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full rounded-lg object-contain"
                        />
                      )}
                    </>
                  )}
                  {!file && (
                    <div className="m-auto" {...getRootProps()}>
                      <div className="flex justify-center">
                        <IconButton
                          //   onClick={() => {
                          //     document.getElementById("filePicker")?.click();
                          //   }}
                          icon={<Plus />}
                        >
                          Выбрать файл
                        </IconButton>
                        {/* <input
                      id="filePicker"
                      title="File picker"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) {
                          if (!file.type.includes("image")) {
                            toast.error("Файл должен быть изображением");
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Максимальный размер файла 5 MB");
                            return;
                          }
                          setFile(file);
                        }
                      }}
                    /> */}
                      </div>
                      <input
                        className="h-[100%] w-[100%]"
                        {...getInputProps()}
                      ></input>
                      <div className="mt-4 flex justify-center">
                        <p>
                          {isDragActive
                            ? "можно отпускать"
                            : "или перетащите файл сюда"}
                        </p>
                      </div>
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>Поддерживаемые форматы: jpg, png</p>
                        <p>Максимальный размер файла: 5 MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="min-h-[400px] rounded-lg md:p-8 lg:shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]">
                  <Form {...form}>
                    <form
                      className="space-y-2"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Название работы</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white"
                                disabled={isCreating}
                                type="text"
                                placeholder="Утро в лесу"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                disabled={isCreating}
                                className="bg-white"
                                placeholder=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Категория</FormLabel>
                            <Shimmer
                              borderRadius={"0.75rem"}
                              isLoaded={!!categories}
                            >
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Выберите категорию" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {[
                                    {
                                      id: "none",
                                      name: "Не выбрана",
                                      slug: "none",
                                    },
                                    ...(categories ?? []),
                                  ].map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Shimmer>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {file && (
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name="iso"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ISO</FormLabel>
                                <FormControl>
                                  <Shimmer
                                    isLoaded={!isExifParsing}
                                    borderRadius={"0.75rem"}
                                  >
                                    <Input
                                      className="bg-white"
                                      disabled={isCreating || isExifParsing}
                                      type="text"
                                      placeholder=""
                                      {...field}
                                    />
                                  </Shimmer>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                          <FormField
                            control={form.control}
                            name="aperture"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Диафрагма</FormLabel>
                                <FormControl>
                                  <Shimmer
                                    isLoaded={!isExifParsing}
                                    borderRadius={"0.75rem"}
                                  >
                                    <Input
                                      className="bg-white"
                                      disabled={isCreating || isExifParsing}
                                      type="text"
                                      placeholder=""
                                      {...field}
                                    />
                                  </Shimmer>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                          <FormField
                            control={form.control}
                            name="exposureTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Выдержка</FormLabel>
                                <FormControl>
                                  <Shimmer
                                    isLoaded={!isExifParsing}
                                    borderRadius={"0.75rem"}
                                  >
                                    <div className="flex">
                                      <Input
                                        id="exposureTime"
                                        className="mr-[1px] rounded-r-none border-r-0 bg-white"
                                        disabled={isCreating || isExifParsing}
                                        type="text"
                                        placeholder=""
                                        {...field}
                                        value={field.value as number}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setUserExposureTime(
                                            decimalToFraction(
                                              parseFloat(e.target.value),
                                            ),
                                          );
                                        }}
                                      />
                                      <Input
                                        className="rounded-l-none border-l-0 bg-white"
                                        value={userExposureTime}
                                        onChange={(e) => {
                                          const value = e.target
                                            .value as string;
                                          setUserExposureTime(value);
                                          const target =
                                            e.target as HTMLInputElement;
                                          if (
                                            /((\d*\d+)\/(\d+$))|(^\-?\d+$)/g.test(
                                              value,
                                            )
                                          ) {
                                            const split = value.split("/");
                                            if (split.length > 1) {
                                              const fraction =
                                                parseInt(split[0]!) /
                                                parseInt(split[1]!);
                                              form.setValue(
                                                "exposureTime",
                                                fraction,
                                              );
                                            } else {
                                              form.setValue(
                                                "exposureTime",
                                                parseInt(value),
                                              );
                                            }
                                            form.clearErrors("exposureTime");
                                          } else {
                                            form.setError("exposureTime", {
                                              message: "Неверное значение",
                                            });
                                          }
                                        }}
                                      ></Input>
                                    </div>
                                  </Shimmer>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                          <FormField
                            control={form.control}
                            name="focusLength"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Фокусное растояние</FormLabel>
                                <FormControl>
                                  <Shimmer
                                    isLoaded={!isExifParsing}
                                    borderRadius={"0.75rem"}
                                  >
                                    <Input
                                      className="bg-white"
                                      disabled={isCreating || isExifParsing}
                                      type="text"
                                      placeholder=""
                                      {...field}
                                    />
                                  </Shimmer>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                        </div>
                      )}
                      <IconButton
                        type="submit"
                        icon={isSubmitting ? <Spinner /> : undefined}
                        disabled={
                          (!file && !src) || isExifParsing || isSubmitting
                        }
                        className="mb-4 mt-4 w-full"
                      >
                        {isSubmitting
                          ? "Загрузка"
                          : !file && !src
                            ? "Выберите файл"
                            : "Загрузить"}
                      </IconButton>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Shimmer>
    </UserLayout>
  );
};

export default UploadPage;
