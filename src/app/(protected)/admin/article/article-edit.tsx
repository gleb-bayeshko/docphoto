import { OutputData } from "@editorjs/editorjs";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import RichText from "~/components/lib/editorjs";
import { Button } from "~/components/ui/button";
import IconButton from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

export const ArticleEdit = ({
  id,
  title,
  hideInputs,
  content,
  description,
}: {
  id?: string;
  title?: string;
  content?: OutputData;
  hideInputs?: boolean;
  description?: string;
}) => {
  const { mutateAsync: createArticle, isPending } =
    api.articles.createArticle.useMutation({});
  const { mutateAsync: editArticle, isPending: isEditPending } =
    api.articles.editArticle.useMutation({});

  const { mutateAsync: deleteArticle, isPending: isDeletePending } =
    api.articles.deleteArticle.useMutation({});
  const router = useRouter();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const form = document.querySelector("form") as HTMLFormElement;
    const id = form.id.value;
    const data = {
      title: form.title.value,
      description: form.description.value,
      contentJson: form.content.value,
    };

    try {
      if (id) {
        await editArticle({ id, input: data });
        toast.success("Статья успешно обновлена");
        return;
      }
      const resp = await createArticle(data);
      router.push(`/admin/article/edit/${resp.id}`);
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(
          Object.values(e.shape.data.zodError.fieldErrors)
            .map((x) => x)
            .join("\n"),
        );
      }
    }
  };

  const onChange = (data: OutputData) => {
    const input = document.querySelector(
      'input[name="content"]',
    ) as HTMLInputElement;
    input.value = JSON.stringify(data);
  };
  const utils = api.useUtils();
  return (
    <div onSubmit={submit}>
      {id && !hideInputs && (
        <div>
          <Button
            onClick={() => {
              deleteArticle({ id: id }).then(() => {
                utils.articles.invalidate();
                router.push("/admin/article");
                router.refresh();
              });
            }}
            variant={"destructive"}
          >
            Удалить статью
          </Button>
          <sub className="my-1 mb-4 block">
            Нажимайте аккуратно, подтверждения действия не будет
          </sub>
        </div>
      )}
      <form className="space-y-2">
        <Input defaultValue={id} type="hidden" name="id"></Input>
        <Input
          defaultValue={title}
          type={hideInputs ? "hidden" : "text"}
          name="title"
          placeholder="Заголовок статьи"
        ></Input>
        <Input
          defaultValue={description}
          name="description"
          type={hideInputs ? "hidden" : "text"}
          placeholder="Короткое описание статьи"
        ></Input>
        <Input
          type="hidden"
          defaultValue={JSON.stringify(content)}
          name="content"
        ></Input>

        <div className="mt-4 rounded-sm border">
          <RichText
            className="mx-8"
            onChange={onChange}
            defaultValue={content}
          />
        </div>
        <IconButton
          icon={(isPending || isEditPending) && <Spinner />}
          disabled={isPending}
        >
          Сохранить
        </IconButton>
      </form>
    </div>
  );
};
