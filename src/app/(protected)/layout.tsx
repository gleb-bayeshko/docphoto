import { getServerAuthSession } from "~/lib/session";
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerAuthSession();
    if (!session) {
        redirect("/signin")
    }

    return children
}