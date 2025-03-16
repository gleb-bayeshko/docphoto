"use client";
import React, { type FC, useEffect, useRef, useState } from "react";
import { type OutputData } from "@editorjs/editorjs";
import { Spinner } from "../ui/spinner";
import { cn } from "~/lib/utils";
import { Switch } from "../ui/switch";

interface IProps {
  readonly?: boolean;
  className?: string;
  defaultValue?: OutputData;
  onChange?: (outputData: OutputData) => void;
}

const RichText: FC<IProps> = ({
  defaultValue,
  readonly,
  className,
  onChange,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      const { default: EditorJS } = await import("@editorjs/editorjs");
      //@ts-expect-error No declaration file found for module '@editorjs/image'.
      const { default: Header } = await import("editorjs-header-with-anchor");
      //@ts-expect-error No declaration file found for module '@editorjs/image'.
      const { default: List } = await import("@editorjs/list");
      //@ts-expect-error No declaration file found for module '@editorjs/image'.
      const { default: ImageTool } = await import("@editorjs/image");

      const editor = new EditorJS({
        holder: "editorjs",
        readOnly: readonly ?? false,
        tools: {
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "/api/editor-image-upload", // Your backend file uploader endpoint
              },
            },
          },
          header: Header,
          list: List,
        },
        data: defaultValue,
        onChange: (api, event) => {
          if (!readonly) {
            api.saver.save().then((outputData) => {
              if (onChange) {
                onChange(outputData);
              }
            });
          }
        },
        i18n: {
          /**
           */
          messages: {
            /**
             * Other below: translation of different UI components of the editor.js core
             */
            ui: {
              blockTunes: {
                toggler: {
                  "Click to tune": "Нажмите, чтобы настроить",
                  "or drag to move": "или перетащите",
                },
              },
              inlineToolbar: {
                converter: {
                  "Convert to": "Конвертировать в",
                },
              },
              toolbar: {
                toolbox: {
                  Add: "Добавить",
                },
              },
            },

            /**
             * Section for translation Tool Names: both block and inline tools
             */
            toolNames: {
              Text: "Параграф",
              Heading: "Заголовок",
              List: "Список",
              Warning: "Примечание",
              Checklist: "Чеклист",
              Quote: "Цитата",
              Code: "Код",
              Delimiter: "Разделитель",
              "Raw HTML": "HTML-фрагмент",
              Table: "Таблица",
              Link: "Ссылка",
              Marker: "Маркер",
              Bold: "Полужирный",
              Italic: "Курсив",
              InlineCode: "Моноширинный",
            },

            /**
             * Section for passing translations to the external tools classes
             */
            tools: {
              /**
               * Each subsection is the i18n dictionary that will be passed to the corresponded plugin
               * The name of a plugin should be equal the name you specify in the 'tool' section for that plugin
               */
              warning: {
                // <-- 'Warning' tool will accept this dictionary section
                Title: "Название",
                Message: "Сообщение",
              },

              /**
               * Link is the internal Inline Tool
               */
              link: {
                "Add a link": "Вставьте ссылку",
              },
              /**
               * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
               */
              stub: {
                "The block can not be displayed correctly.":
                  "Блок не может быть отображен",
              },
            },

            /**
             * Section allows to translate Block Tunes
             */
            blockTunes: {
              /**
               * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
               * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
               *
               * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
               */
              delete: {
                Delete: "Удалить",
              },
              moveUp: {
                "Move up": "Переместить вверх",
              },
              moveDown: {
                "Move down": "Переместить вниз",
              },
            },
          },
        },
        onReady() {
          Array.from(document.querySelectorAll(".ce-header")).forEach((x) => {
            const elem = x as HTMLDivElement;
            if (elem.dataset.anchor) {
              elem.id = elem.dataset.anchor;
            }
          });
          setTimeout(() => {
            Array.from(
              document.querySelectorAll(".image-tool__caption"),
            ).forEach((x) => {
              if (x.textContent === "") {
                (x as HTMLDivElement).style.display = "none";
              }
            });
          }, 1000);
        },
      });
    })();
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                ${
                  readonly &&
                  `
                    .ce-header::after {
                        display: none !important;
                        content: none !important;
                    }  
                  `
                }
            `,
        }}
      ></style>
      <div id="editorjs" className={cn("docphoto-article", className)}></div>
    </>
  );
};

export default RichText;
