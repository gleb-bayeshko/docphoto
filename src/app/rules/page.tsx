import React, { FC } from "react";
import UserLayout from "~/components/blocks/layout";

interface IProps {}

const RulesPage: FC<IProps> = (props) => {
  return (
    <UserLayout>
      <style
        dangerouslySetInnerHTML={{
          __html: `
			p { margin:0pt }
			li { margin-top:0pt; margin-bottom:0pt }
			.BalloonText { font-family:'Times New Roman'; font-size:9pt }
			.CommentSubject { font-size:10pt; font-weight:bold }
			.CommentText { font-size:10pt }
			.ListParagraph { margin-left:36pt; font-size:12pt }
			span.CommentReference { font-size:8pt }
			span.Hyperlink { text-decoration:underline; color:#0563c1 }
			span.UnresolvedMention { color:#605e5c; background-color:#e1dfdd }
			span.a1 { font-family:'Times New Roman'; font-size:9pt }
			span.a { font-size:10pt }
			span.a0 { font-size:10pt; font-weight:bold }`,
        }}
      ></style>
      <p>
        <strong>ПРАВИЛА САЙТА / ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ lineHeight: "80%" }}>
        <u>Что такое DocPhoto</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Модерация фотографий и комментариев</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Вступление в DocPhoto</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Статусы авторов</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Рейтинги</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Лучшие фотографии раздела</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Условия для загрузки фотографий</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <u>Участие в объявленном фотоконкурсе</u>
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <strong>ВНИМАНИЕ!</strong>
      </p>
      <p style={{ lineHeight: "80%" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Права на все фотографии, размещенные на DocPhoto.pro, принадлежат
        авторам этих фото. По вопросам использования фотографий в каких-либо
        целях убедительная просьба обращаться к их авторам. Контакты авторов вы
        можете найти на их личной странице или же связаться через личные
        сообщения.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        <strong>ЧТО ТАКОЕ DOCPHOTO.PRO?</strong>
      </p>
      <p style={{ lineHeight: "80%" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Этот сайт представляет собой интерактивный клуб для специалистов системы
        здравоохранения, где наиболее удобно, полно и зрелищно реализовано
        общение энтузиастов фотоискусства на русском языке! Участники могут
        показывать друг другу и тысячам зрителей фотографии, получать и писать
        отзывы, участвовать в рейтингах и конкурсах, заводить творческие
        контакты, накапливать собственное портфолио... Все это дает
        неограниченные возможности приятного досуга и творческого роста
        одновременно.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Зарегистрированные пользователи DocPhoto размещают фотографии
        самостоятельно, Администрация DocPhoto осуществляет только
        пост-модерацию. Однако мы не приветствуем появление на сайте
        бессодержательных для стороннего зрителя семейных фотографий, вроде «я
        на фоне дачи, памятника...». Подразумевается, что автор сам может
        оценить достоинства своего произведения. Если это затруднительно,
        приглашаем вас посмотреть уже имеющиеся на сайте и высоко оцененные
        работы, например, в рейтинге лучших.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Зарегистрированный пользователь, разместивший фотографию на
        DocPhoto.pro, гарантирует, что является автором фотографии и/или ему
        принадлежат исключительные права на данную фотографию.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        При размещении фотографий с изображениями людей зарегистрированный
        пользователь гарантирует, что им получено согласие на размещение
        изображения человека в Интернете, либо на фотографии модель, которой
        были оплачены услуги, либо съемка была сделана в общественном месте и
        изображенный человек является не основным объектом съемки. Кроме того,
        зарегистрированный пользователь гарантирует, что ни фотография в целом,
        ни какие-либо из ее частей не будут нарушать законодательство о товарных
        знаках, авторском праве и смежных правах, законные права и интересы
        третьих лиц, не нанесут ущерба их чести, достоинству и деловой
        репутации, что получены соответствующие разрешения от всех лиц,
        организаций или учреждений, чьи права могли быть затронуты в ходе
        создания фотографии, в том числе получено согласие на осуществление
        съемки от лица, являющегося владельцем помещения, внутри которого
        производилась фотосъемка.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Публикуя фотографию на DocPhoto.pro, зарегистрированный пользователь тем
        самым дает свое согласие Администрации DocPhoto на воспроизведение этой
        фотографии, ее распространение в Интернете на DocPhoto и на официальных
        страницах DocPhoto в социальных сетях (с обязательной ссылкой на автора
        фотографии) по простой лицензии на территории всех стран мира на весь
        срок действия исключительного права или до момента удаления фотографии с
        сайта зарегистрированным пользователем.
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        На сайте не так много запретов, и все они лежат в пределах разумного.
        Запрещается размещать на DocPhoto фотографии и комментарии к ним,
        содержащие:
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        клевету и оскорбление, не соответствующие действительности сведения;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        информацию непристойного характера;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        сцены суицида, насилия, пропаганду и публичное демонстрирование
        нацистской атрибутики или символики, призывы к разжиганию
        межнациональной розни;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        религиозную символику, используемую в целях оскорбления религиозных
        чувств верующих;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        предлагающие товары/услуги, оборот которых запрещен или ограничен
        законодательством;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        сведения о частной жизни, нарушающие персональные данные третьих лиц,
        личную и семейную тайну, право на изображение;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        государственную тайну, иные конфиденциальные сведения;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        ненормативную лексику;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        высказывания экстремистского характера;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        призывы к массовым беспорядкам, участию в массовых (публичных)
        мероприятиях, проводимых с нарушением установленного порядка;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        любую информацию, нарушающую права третьих лиц.
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        ВСЕ фотографии, содержащие обнаженную натуру, должны быть отмечены
        соответствующей галочкой при загрузке. К публикации запрещены
        фотографии, содержащие:
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        порнографию;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        сцены в жанре Ню с участием несовершеннолетних;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        непосредственное, вульгарно-натуралистическое изображение половых
        органов и/или полового акта;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        сцены с использованием предметов из ассортимента интимных магазинов;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        сцены, унижающие человеческое достоинство.
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Запрещаются оскорбления других пользователей DocPhoto в комментариях,
        публичное выяснение отношений в оскорбительной форме, непристойное
        поведение. Категорически запрещена оценках внешних данных и личностных
        качеств изображенных на фотографиях моделей.
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Запрещается прямая реклама товаров и сторонних конкурирующих ресурсов в
        именах и никнеймах пользователей на сайте, в названии фотографий и др.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        Публикация поздравительных открыток с компьютерной обработкой и
        наложением текста на изображение категорически запрещена. Поздравление
        вы сможете оставить под фотографией в описании работы.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Кроме того, запрещено использование средств автоматизации для
        проставления оценок, публикации комментариев или регистрации новых
        аккаунтов. Их использование влечет за собой удаление аккаунта, с
        которого производились подобные действия.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>Аккаунт может быть заблокирован за:</p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        осознанное неоднократное нарушение правил комментирования работ (флуд,
        употребление ненормативной лексики, создание провокационных
        комментариев, цель которых вызвать конфликты или оскорбить участников
        сообщества);
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        осознанное неоднократное нарушение правил размещения фотографий;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify", lineHeight: "80%" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        рассылку рекламы и спама в личных сообщениях.
      </p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", lineHeight: "80%" }}>
        Поскольку не всегда возможно точно определить те или иные нарушения
        правил, то окончательное решение всегда остаётся за (выносится)
        Администрацией DocPhoto и оно не подлежит обсуждению.
      </p>
      <p style={{ lineHeight: "80%" }}>&nbsp;</p>
      <p style={{ lineHeight: "80%" }}>
        Удалить свой аккаунт с DocPhoto можно прислав письмо на{" "}
        contact@docphoto.pro
        с того адреса, на который зарегистрирован аккаунт.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>МОДЕРАЦИЯ ФОТОГРАФИЙ И КОММЕНТАРИЕВ</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        Модерация фотографий и комментариев авторов в статусе «Фотограф» и
        «Зритель» осуществляется Администрацией DocPhoto в пост-режиме.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        За нарушение правил пользовательского соглашения зарегистрированный
        пользователь может заблокирован на срок от 7 дней до 42 дней, при
        регулярных злонамеренных нарушениях аккаунт может быть удален с DocPhoto
        со всеми фотографиями и оценками.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Фотографии авторов, недавно зарегистрированных в статусе «Фотограф»
        проходят обязательную модерацию. Администрация DocPhoto проверяет работы
        на соответствие правилам размещения работ и разрешает им остаться в
        соответствующих рубриках или удаляет с рекомендациями автору. После
        прохождения проверки работы станут доступны для просмотра посетителям
        DocPhoto.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Запрещается публичное обсуждение решений Администрации DocPhoto в сфере
        модерации фотографий и комментариев. Любые предложения, жалобы и
        замечания принимаются только на e-mail:{" "}
        contact@docphoto.pro.
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        <strong>ВСТУПЛЕНИЕ В DOCPHOTO</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        Для того, чтобы вступить в клуб DocPhoto, необходимо пройти регистрацию,
        выбрать статус «Фотограф» и получить пароль на указанный при регистрации
        e-mail. После этого Вы получаете возможность присылать фото и писать
        комментарии.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Основанием для отказа в присвоении статуса члена DocPhoto является хотя
        бы одно из следующих действий:
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        Размещение на сайте фотографий, противоречащих правилам DocPhoto;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        Размещение на сайте чужих фото под своим именем;
      </p>
      <p
        className="ListParagraph"
        style={{ textIndent: "-18pt", textAlign: "justify" }}
      >
        <span style={{ fontFamily: "Symbol" }}></span>
        <span
          style={{
            width: "11.41pt",
            font: '7pt "Times New Roman"',
            display: "inline-block",
          }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
        </span>
        Размещение коллажей, составленных из чужих фотографий или фото из
        клипартов.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Художественные или технические недостатки присланных фото не являются
        критерием для отказа в приеме в члены клуба.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        <strong>СТАТУСЫ АВТОРОВ</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        Начинающий «Фотограф» может выложить на сайт всего 7 фотографий, но не
        более 5 работ за неделю. После того, как выложена седьмая фотография,
        статус автора автоматически меняется с начинающего на постоянного
        «Фотографа», и он считается принятым в клуб.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Для всех участников клуба установлены единые лимиты на загрузку - 7
        фотографий в неделю, при условии, что данная фотография не участвует в
        фотоконкурсе, объявленном ранее.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Новый день отсчитывается через 24 часа после добавления фото, а не при
        наступлении следующих суток.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        <strong>РЕЙТИНГИ</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        Рейтинги DocPhoto строятся на основании рекомендаций, которые получают
        работы от посетителей других «Фотографов» и «Зрителей», а также
        количества просмотров работ и количества комментариев к ним.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Авторам, зарегистрировавшимся на DocPhoto, строго запрещается каким-либо
        образом влиять на свой собственный рейтинг или рейтинг своих собственных
        фотографий. Помимо того, не рекомендуется массовая рассылка однотипных
        комментариев, а владельцам нескольких аккаунтов запрещается влиять на
        рейтинг других авторов или других фотографий с более чем одного
        аккаунта. В случае выявления упомянутых нарушений будут применены
        санкции вплоть до удаления всех аккаунтов, замеченных в некорректных
        действиях.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        <strong>ЛУЧШИЕ ФОТОГРАФИИ РАЗДЕЛА</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        В лучшие фото раздела отбираются фотографии, попадавшие в претенденты на
        Фото дня, из размещенных более 6 часов назад (то есть более не имеющие
        возможности стать Фото дня).
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Лучшая фотография определяется по количеству голосов, отданных за нее
        любым зарегистрированным пользователем.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Фотографии отображаются в порядке размещения (свежие – вверху).
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        <strong>УСЛОВИЯ ДЛЯ ЗАГРУЗКИ ФОТОГРАФИЙ</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        <strong>&nbsp;</strong>
      </p>
      <p style={{ textAlign: "justify" }}>
        Работы (фотографии) должны быть представлены в цифровом формате
        (допускаются изображения в виде сканированных диапозитивов или негативов
        высокого разрешения).
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Цифровые файлы предоставляются в формате JPEG. Размер изображения — не
        менее 1000 и не более 4000 пикселей по его длинной стороне. Данное
        требование не распространяется на снимки, поданные в номинацию
        «Мобильная фотография». Масштабирование снимка в сторону увеличения не
        допускается. Желательно, чтобы файл изображения содержал профиль
        рабочего пространства для соблюдения правильной цветопередачи.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Максимальный размер загружаемого файла не более 5 Мб
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify", fontSize: "10pt" }}>
        <em>
          Рекомендация для участников DocPhoto: если вы не планируете в будущем
          печать фотографий для размещения на стенке или в альбоме любимой
          бабушки, старайтесь располагать объект съемки в горизонтальном кадре.
          Как правило, большинство пользователей компьютеров не имеют
          возможности повернуть дисплей вертикально, а вертикальное изображение
          «крадет» у монитора почти 2/3 полезного пространства. Однако, если вы
          не видите свой объект съемки в кадре иначе, можете спокойно
          игнорировать данную рекомендацию.
        </em>
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        <strong>УЧАСТИЕ В ОБЪЯВЛЕННОМ ФОТОКОНКУРСЕ</strong>
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Сайт DocPhoto может использоваться для проведения различных
        фотоконкурсов среди работников здравоохранения согласно прилагаемым
        правилам фотоконкурса и положению о фотоконкурсе. С информацией о
        проведении конкурса «МИР ГЛАЗАМИ ВРАЧЕЙ – 2024» можно ознакомится на
        страницах сайтов организаторов мероприятия.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "justify" }}>
        Обязательным условием при размещении конкурсной работы является
        маркировка в дополнительном описании чрез хештег #фотоконкурс_1, где
        цифра обозначает номер загружаемой фотографии в ту или иную номинацию.
      </p>
      <p style={{ textAlign: "justify" }}>&nbsp;</p>
      <p style={{ textAlign: "right" }}>
        <em>Редакция от 23.06.2024 г.</em>
      </p>
    </UserLayout>
  );
};

export default RulesPage;
