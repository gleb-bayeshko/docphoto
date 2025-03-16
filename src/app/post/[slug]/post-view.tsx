"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import UserLayout from "~/components/blocks/layout";
import { RouterOutputs, api } from "~/trpc/react";
import Image from "next/image";
import { cn, decimalToFraction, layoutPaddings, voidToken } from "~/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit2,
  EllipsisVertical,
  Eye,
  MessageCircle,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { useIntersectionObserver, useLocalStorage } from "usehooks-ts";
import toast, { CheckmarkIcon } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCommentInputSchema,
  updateContentInputSchema,
} from "~/server/api/schemas/posts";
import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/ui/icon-button";
import { Spinner } from "~/components/ui/spinner";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
dayjs.locale({
  ...ru,
  weekStart: 1,
});
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import Loader from "~/components/ui/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import NextJsImage from "~/components/ui/lightbox-next-image";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("ru");
interface IProps {
  post: RouterOutputs["posts"]["getBySlug"];
}

const backgrounds = [
  "bg-[#ffffff]",
  "bg-[#ECECEC]",
  "bg-[#D9D9D9]",
  "bg-[#AEAEAE]",
  "bg-[#838383]",
  "bg-[#4B4B4B]",
  "bg-[#191919]",
  "bg-[#000000]",
];

const PostView: FC<IProps> = (props) => {
  const { data: session } = useSession();
  const post = props.post!;

  const { data: adjacentPosts, isFetching: isAdjacentPostsFetching } =
    api.posts.getNextAndPreviousPosts.useQuery(
      { postId: post.id },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    );

  const { data: fullUser } = api.auth.getFullUser.useQuery(voidToken, {
    enabled: !!session,
  });

  const [likes, setLikes] = useState(post._count.likes);
  const [liked, setLiked] = useState(post.liked);
  const ratio = post.width / post.height;
  const [selectedBackground, setSelectedBackground] = useState(5);
  useEffect(() => {
    setSelectedBackground(
      parseInt(localStorage.getItem("prefferedBackground") ?? "5"),
    );
  }, []);
  const formatter = Intl.NumberFormat("ru", { notation: "compact" });

  const { mutateAsync: likePost } = api.posts.likePost.useMutation({
    onError: () => {
      toast.error("Не удалось добавить отметку Нравится");
      setLikes((prev) => prev - 1);
      setLiked(false);
    },
    onSuccess: ({ likes, isLiked }) => {
      setLikes(likes);
      setLiked(isLiked);
    },
  });

  const shutterSpeed = decimalToFraction(
    parseFloat(
      post.metadata.find((x) => x.key === "shutterSpeed")?.value ?? "1",
    ),
  );
  let iso = post.metadata.find((x) => x.key === "iso")?.value;
  if (iso) {
    iso = "ISO " + iso;
  }
  const camera = post.metadata.find((x) => x.key === "camera")?.value;
  const createDate = post.metadata.find((x) => x.key === "createDate")?.value;
  const aperture = post.metadata.find((x) => x.key === "aperture")?.value;
  const focalLength = post.metadata.find((x) => x.key === "focalLength")?.value;

  const form = useForm<z.infer<typeof createCommentInputSchema>>({
    resolver: zodResolver(createCommentInputSchema),
    defaultValues: {
      postId: post.id,
      text: "",
    },
  });

  const [createdComments, setCreatedComments] = useState<
    (RouterOutputs["posts"]["createComment"] & {
      isOwner: boolean;
    })[]
  >([]);
  const { data, fetchNextPage, isFetching, fetchPreviousPage } =
    api.posts.getComments.useInfiniteQuery(
      {
        postId: post.id,
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        getNextPageParam: (lastPage) => {
          return lastPage.nextPage ?? undefined;
        },
      },
    );
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: false,
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  const flatPosts = useMemo(() => {
    return data?.pages?.flatMap((x) => x.comments);
  }, [data]);

  const { mutateAsync: createComment, isPending: isCommentCreating } =
    api.posts.createComment.useMutation({
      onError: () => {
        toast.error("Не удалось добавить комментарий");
      },
      onSuccess: (comment) => {
        form.reset({
          postId: post.id,
          text: "",
        });
        toast.success("Комментарий добавлен");
        setCreatedComments((prev) => [{ ...comment, isOwner: true }, ...prev]);
      },
    });

  const [deletedComments, setDeletedComments] = useState<string[]>([]);

  const { mutateAsync: deleteComment, isPending: isCommentDeleting } =
    api.posts.deleteComment.useMutation({
      onError: () => {
        toast.error("Не удалось удалить комментарий");
      },
      onSuccess: (comment) => {
        toast.success("Комментарий удален");
        setDeletedComments((prev) => [...prev, comment.id]);
      },
    });

  const onSubmit = async (data: z.infer<typeof createCommentInputSchema>) => {
    if (!session) {
      return;
    }
    createComment(data);
  };

  const { mutateAsync: deletePostMutation } =
    api.posts.removePost.useMutation();

  const router = useRouter();

  const deletePost = () => {
    const abortSignal = new AbortController();
    toast.promise(
      new Promise((r, rj) => {
        let count = 0;
        const interval = setInterval(() => {
          if (abortSignal.signal.aborted) {
            r("CANCEL");
            return;
          }
          if (count >= 55) {
            clearInterval(interval);
            deletePostMutation({ postId: post.id }).then(() =>
              router.push("/"),
            );
            r("OK");
          }
          count += 1;
        }, 100);
      }),
      {
        loading: (
          <div className="flex w-full  items-center justify-between">
            <div>Вы уверены?</div>
            <Button variant={"ghost"} onClick={() => abortSignal.abort()}>
              Отменить
            </Button>
          </div>
        ),
        success: (e) => (e === "CANCEL" ? "Отменено" : "Фото удалено"),
        error: <div>Ошибка при удалении</div>,
      },
      {
        className: "w-[95vw] h-[60px] md:w-[500px]",
        loading: {
          icon: <Loader duration={5} />,
        },
        success: {
          icon: <CheckmarkIcon />,
        },
        error: {
          icon: <Trash />,
        },
        position: "bottom-center",
      },
    );
  };

  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const editPostForm = useForm<z.infer<typeof updateContentInputSchema>>({
    resolver: zodResolver(updateContentInputSchema),
    defaultValues: {
      name: post.name,
      description: post.description ?? undefined,
    },
  });

  const { mutateAsync: editPostAsync, isPending } =
    api.posts.updateContent.useMutation({
      onSuccess: () => {
        location.reload();
      },
    });

  const editPost = () => {
    setEditModalOpen(true);
  };

  return (
    <>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <h1 className="text-2xl font-bold">Редактирование фото</h1>
          </DialogHeader>
          <Form {...editPostForm}>
            <form
              onSubmit={editPostForm.handleSubmit((d) =>
                editPostAsync({
                  postId: post.id,
                  input: {
                    name: d.name,
                    description: d.description.trim(),
                  },
                }),
              )}
            >
              <FormField
                control={editPostForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название фото</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Название фото"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={editPostForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание фото</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        placeholder="Описание фото"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <IconButton
                className="mt-2 w-full"
                icon={isPending ? <Spinner /> : <></>}
                disabled={isPending}
              >
                Обновить
              </IconButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <UserLayout withPadding={false}>
        <Lightbox
          zoom={{
            scrollToZoom: true,
            maxZoomPixelRatio: 500,
            zoomInMultiplier: 1,
            doubleTapDelay: 2,
            doubleClickDelay: 300,
            doubleClickMaxStops: 300,
            keyboardMoveDistance: 2,
            wheelZoomDistanceFactor: 50,
            pinchZoomDistanceFactor: 100,
          }}
          plugins={[Zoom]}
          styles={{
            container: {
              backgroundColor:
                backgrounds[selectedBackground]!.split("[")[1]!.split("]")[0]!,
            },
          }}
          open={isLightBoxOpen}
          close={() => setIsLightBoxOpen(false)}
          slides={[
            { src: post.imageUrl, height: post.height, width: post.width },
          ]}
          render={{
            slide: NextJsImage,
            buttonPrev: () => null,
            buttonNext: () => null,
            buttonZoom: () => <div></div>,
            iconZoomIn: () => <div></div>,
            iconZoomOut: () => <div></div>,
          }}
        />
        <div
          className={`relative mt-8 grid w-full grid-cols-1 place-items-center transition-colors  duration-500 md:grid-cols-[48px,1fr,48px] ${backgrounds[selectedBackground]} ${ratio > 2 ? "py-6" : "md:py-4"}`}
        >
          {adjacentPosts?.prev && (
            <Link href={`/post/${adjacentPosts.prev}`}>
              <ArrowLeft
                className={`left-[12px] max-md:absolute ${selectedBackground < 4 ? "text-black" : "text-white"} h-[32px] w-[32px] cursor-pointer transition-colors`}
              />
            </Link>
          )}
          <Image
            quality={100}
            priority={true}
            className={`col-start-2 object-contain ${ratio > 2 ? "md:max-h-[40vh]" : "md:max-h-[60vh]"} `}
            alt={post.name}
            width={10000}
            height={10000}
            src={post.imageUrl}
            onClick={() => setIsLightBoxOpen(true)}
          />
          {adjacentPosts?.next && (
            <Link href={`/post/${adjacentPosts.next}`}>
              <ArrowRight
                className={`right-[12px] z-[1000] max-md:absolute ${selectedBackground < 4 ? "text-black" : "text-white"} col-start-3 h-[32px] w-[32px] cursor-pointer transition-colors`}
              />
            </Link>
          )}
        </div>
        <div className={`${layoutPaddings()}`}>
          <div
            className={`
          mt-[50px] flex flex-col items-center justify-between lg:flex-row
        `}
          >
            <div className="flex h-[64px] flex-wrap items-center gap-4">
              {backgrounds.map((background, index) => (
                <div
                  onClick={() => setSelectedBackground(index)}
                  key={index}
                  className="relative"
                >
                  <div
                    className={`cursor-pointer rounded-full duration-500 ${background} transition-all ${index === selectedBackground ? "h-8 w-8 lg:h-12 lg:w-12" : "h-6 w-6 lg:h-8 lg:w-8"} ${index === 0 && "border border-gray-400 "}`}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex h-[64px] items-center gap-8">
              <div
                onClick={() => {
                  if (!session) {
                    toast.error("Войдите, чтобы поставить отметку Нравится");
                    return;
                  }
                  likePost({ postId: post.id });
                  if (!liked) {
                    setLiked(true);
                    setLikes((prev) => prev + 1);
                  } else {
                    setLiked(false);
                    setLikes((prev) => prev - 1);
                  }
                }}
                className={`flex h-[40px] cursor-pointer select-none items-center rounded-full bg-gray-100 px-[17px] py-[10px] font-semibold hover:bg-gray-200 ${liked ? "text-primary" : ""}`}
              >
                <ThumbsUp />
                <span className="ml-2 max-sm:hidden">Нравится</span>
                <div className="mx-2 h-[70%] border-r border-gray-500"></div>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatter.format(likes)}
                </span>
              </div>
              <div className="flex h-[40px] cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-[17px] py-[10px] font-semibold hover:bg-gray-200">
                <Eye />
                {formatter.format(post.views)}
                <div className="mx-2 h-[70%] border-r border-gray-500"></div>
                <MessageCircle size={22} />
                {formatter.format(post._count.comments)}
              </div>
              {post.isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white p-2">
                    <DropdownMenuItem className="p-0 hover:bg-inherit">
                      <IconButton
                        onClick={editPost}
                        variant={"ghost"}
                        icon={<Edit2 />}
                      >
                        Редактировать
                      </IconButton>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 hover:bg-inherit">
                      <IconButton
                        onClick={deletePost}
                        className="text-destructive hover:text-destructive"
                        variant={"ghost"}
                        icon={<Trash />}
                      >
                        Удалить
                      </IconButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="mt-[56px] flex items-start gap-6">
            <div>
              <Image
                width={72}
                height={72}
                src={post.author.avatarUrl ?? "/no-avatar.webp"}
                alt="Avatar"
                className="rounded-full"
              />
            </div>
            <div className="w-full">
              <p className="text-[32px] font-semibold">{post.name}</p>
              <Link
                className="text-sm font-light italic"
                href={`/author/${post.author.username}`}
              >
                {post.author.username}
              </Link>
              <div className="flex w-full flex-col items-start justify-between md:flex-row">
                <div className="max-w-[400px]">
                  {post.description && post.description.length > 0 && (
                    <div className="mt-5 bg-gray-300 p-3 text-sm">
                      <p>{post.description}</p>
                    </div>
                  )}
                </div>
                <div className="text-sm max-sm:mt-4">
                  <p>
                    <strong>Категория</strong>: {post.category.name}
                  </p>
                  <p>
                    <strong>Exif</strong>:{" "}
                    {[
                      shutterSpeed && `${shutterSpeed}s`,
                      iso && `${iso}`,
                      aperture && `f/${aperture}`,
                      focalLength && `${focalLength}mm`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {camera && (
                    <p>
                      <strong>Снято на</strong>: {camera}
                    </p>
                  )}
                  {createDate && new Date(createDate) && (
                    <p>
                      <strong>Время съемки</strong>:{" "}
                      {new Date(createDate).toLocaleString("ru")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[56px]">
            <div className="text-[28px] font-semibold">
              {post._count.comments > 0 ? "Комментарии" : "Комментариев нет"}
            </div>
            <div className="mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex items-start gap-5">
                    <div>
                      <Image
                        width={48}
                        height={48}
                        draggable={false}
                        src={fullUser?.avatarUrl ?? "/no-avatar.webp"}
                        alt="Avatar"
                        className="rounded-full"
                      />
                    </div>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                onFocus={(e) => {
                                  if (!session) {
                                    e.target.blur();
                                    toast.error(
                                      "Войдите или зарегистрируйтесь, чтобы оставить комментарий",
                                    );
                                  }
                                }}
                                className="min-h-[100px] w-full md:w-[70%]"
                                placeholder="Текст комментария"
                                {...field}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                      <div className="mt-4 flex  w-full justify-end md:w-[70%]">
                        <IconButton
                          disabled={!session || isCommentCreating}
                          icon={isCommentCreating && <Spinner />}
                        >
                          Отправить
                        </IconButton>
                      </div>
                      <FormField
                        control={form.control}
                        name="postId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                              <Input
                                type="hidden"
                                placeholder="ID"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            <div className="mt-4">
              {flatPosts &&
                [...createdComments, ...flatPosts]
                  .filter((x) => !deletedComments.includes(x.id))
                  .map((comment) => (
                    <div key={comment.id} className="mt-4">
                      <div className="flex items-start gap-4">
                        <div className="min-h-[48px] min-w-[48px]">
                          <Image
                            width={48}
                            height={48}
                            src={comment.author.avatarUrl ?? "/no-avatar.webp"}
                            alt="Avatar"
                            className="rounded-full"
                          />
                        </div>
                        <div className="w-full">
                          <Link
                            href={`/author/${comment.author.username}`}
                            className="text-md font-semibold"
                          >
                            {comment.author.username}
                          </Link>
                          <p className="my-3 break-words text-sm md:w-[60%]">
                            {comment.comment}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dayjs.utc(comment.createdAt).fromNow()}
                            {comment.isOwner && (
                              <>
                                <span> - </span>
                                <span
                                  onClick={() =>
                                    deleteComment({ commentId: comment.id })
                                  }
                                  className="cursor-pointer text-red-500"
                                >
                                  Удалить
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              <div className="">{isFetching && <Spinner />}</div>
              {data?.pages && data.pages.length > 0 && <div ref={ref}></div>}
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default PostView;
