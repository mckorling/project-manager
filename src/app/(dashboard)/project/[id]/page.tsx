import TaskCard from "@/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

type ProjectPageParams = {
    params: {
        id: string
    }
}

const getData = async (id: string) => {
    const user = await getUserFromCookie(cookies() as RequestCookies);
    const project = await db.project.findFirst({
        where: { id, ownerId: user?.id },
        include: {
            tasks: true,
        },
    });

    return project;
};

export default async function ProjectPage({ params }: ProjectPageParams) {
    const project = await getData(params.id);

    return (
        <div className="h-full overflow-y-auto pr-6 w-1/1">
            {/* get an error because typescipt doesn't know how to handle ones that return promises */}
            {/* @ts-expect-error Server Component */}
            <TaskCard tasks={project.tasks} title={project.name} />
        </div>
    );
}
