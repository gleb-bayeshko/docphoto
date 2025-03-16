import { NextRequest } from "next/server";
import { env } from "~/env";
import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
dayjs.locale({
    ...ru,
    weekStart: 1
})
import utc from "dayjs/plugin/utc";
import { db } from "~/server/db";
dayjs.extend(utc)

export const dynamic = 'force-dynamic'


export const GET = async (req: NextRequest) => {
    const query = new URL(req.url).searchParams;
    const type = query.get("type") as "month" | "week" | "day" | null;
    const apiKey = query.get("apiKey");
    if (!type || !apiKey || !["month", "week", "day"].includes(type)) {
        return new Response(null, { status: 400 });
    }
    if (apiKey !== env.CRON_API_KEY) {
        return new Response(null, { status: 401 });
    }

    const afterDate = dayjs.utc().startOf(type as any)

    const topPosts = await db.topPost.findMany({
        where: {
            type: type,
            createdAt: {
                gte: afterDate.toDate()
            }
        },
        include: {
            post: true
        }
    })

    const post = await db.post.findFirst({
        where: {
            createdAt: {
                gte: afterDate.toDate()
            },
            report: null,
            NOT: {
                id: {
                    in: topPosts.map(x => x.postId)
                }
            }
        },
        orderBy: {
          likes: {
            _count: "desc"
          }  
        }
    })
    if (!post) {
        return new Response('no post found', { status: 404 });
    }

    await db.topPost.create({
        data: {
            postCreatedAt: post.createdAt,
            type: type,
            post: {
                connect: {
                    id: post.id
                }
            }
        }
    })

    return new Response('ok', {
        headers: {
            "Content-Type": "application/json",
        },
    });
    
}