import TaskCard from "@/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// this is a dynamic page, we know this because the parent folder has []

// added for params type
type ProjectPageParams = {
    params: {
        id: string
    }
}

const getData = async (id: string) => {
    const user = await getUserFromCookie(cookies());
    const project = await db.project.findFirst({
        where: { id, ownerId: user?.id },
        include: {
            tasks: true,
        },
    });

    return project;
};
// projects come in server side
// so we can create a new project but it won't automatically load


// params automatically get passed in because it's a dynamic page
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
