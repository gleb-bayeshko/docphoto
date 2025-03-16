"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Files, Plus, X } from "lucide-react";
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
import {
  createContentInputSchema,
  createReportageInputSchema,
} from "~/server/api/schemas/posts";
import { RouterOutputs, api } from "~/trpc/react";
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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [images, setImages] = React.useState<{ file: File; src: string }[]>([]);
  const { mutateAsync: createReportage, isPending: isCreationPending } =
    api.posts.createReportage.useMutation({
      onSuccess(data) {
        toast.success("Репортаж успешно загружен");
        setImages([]); // clear images
        form.reset(defaultValues);
        router.push(`/reportage/${data.slug}`);
      },
    });
  const { mutateAsync: createPresignedUrls, isPending: isUrlsPending } =
    api.uploads.createPresignedUrls.useMutation();
  const isCreating = false;

  const defaultValues = {
    title: "",
    description: "",
    imageKeys: [],
  };
  const form = useForm<z.infer<typeof createReportageInputSchema>>({
    resolver: zodResolver(createReportageInputSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const onSubmit = async (data: z.infer<typeof createReportageInputSchema>) => {
    if (images.length < 2) {
      toast.error("Добавьте как минимум 2 фотографии");
      return;
    }
    setIsSubmitting(true);
    const urls: RouterOutputs["uploads"]["createPresignedUrls"][] = [];
    for await (const image of images) {
      const url = await createPresignedUrls({ contentType: image.file.type });
      urls.push(url);
      await uploadFileToS3(
        url.url,
        await fileToBuffer(image.file),
        image.file.type,
      );
    }
    try {
      const id = await createReportage({
        ...data,
        imageKeys: urls.map((x) => x.key),
      });
      console.log(id);
    } catch (e) {
      console.error(e);
      toast.error("Произошла ошибка при загрузке репортажа");
    }

    setIsSubmitting(false);
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const canAddMore = 12 - (acceptedFiles.length + images.length);
        console.log(canAddMore, acceptedFiles.length, images.length);
        if (canAddMore < 0) {
          toast.error("Вы можете добавить до 12 фотографий в репортаж");
        } else {
          const processed = acceptedFiles
            .filter((x, i) => x.size <= 1024 * 1024 * 5)
            .map((x) => {
              return { file: x, src: URL.createObjectURL(x) };
            });
          setImages((prev) => [...prev, ...processed].filter((_, i) => i < 13));
        }
      }
    },
    [images.length],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <UserLayout>
      <Shimmer className="rounded-xl" isLoaded={!!user}>
        {user?.siteRole === "viewer" && (
          <div className="flex h-[400px] flex-col items-center justify-center">
            <h1 className="mb-4 text-[32px] font-bold">
              Загрузка репортажей доступна только фотографам
            </h1>
            <Link href="/settings/equipment">
              <Button className="mt-4">Стать фотографом</Button>
            </Link>
          </div>
        )}
        {user?.siteRole === "photopgrapher" && (
          <div>
            <h1 className="mb-4 text-[32px] font-bold">Загрузить репортаж</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]">
              <div className="min-h-[400px] rounded-lg md:p-8">
                <input
                  className="h-[100%] w-[100%]"
                  {...getInputProps()}
                  accept="image/png,image/jpeg"
                ></input>
                <div className="mt-4 flex justify-center">
                  <p {...getRootProps()}>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex items-center justify-center",
                        isDragActive ? "bg-gray-200" : "bg-gray-100",
                      )}
                    >
                      <Files className="mr-2" />
                      <span>Выберите файлы</span>
                    </Button>
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((x, i) => (
                    <div key={i} className="relative">
                      <img
                        src={x.src}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                      <IconButton
                        icon={<X />}
                        className="absolute right-1 top-1"
                        onClick={() => {
                          setImages((prev) => prev.filter((_, j) => j !== i));
                        }}
                      ></IconButton>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="min-h-[400px] rounded-lg md:p-8 ">
                  <Form {...form}>
                    <form
                      className="flex h-full flex-col space-y-2"
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
                                placeholder="Мероприятие в Лувре"
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
                                className="min-h-[300px] bg-white"
                                placeholder=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>

                      <div className="flex justify-end">
                        <IconButton
                          type="submit"
                          icon={isSubmitting ? <Spinner /> : undefined}
                          disabled={isSubmitting || images.length < 2}
                          className="mb-4 mt-auto w-full"
                        >
                          {isSubmitting
                            ? "Загрузка"
                            : images.length < 2
                              ? "Выберите как минимум 2 фотографии"
                              : "Загрузить"}
                        </IconButton>
                      </div>
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
