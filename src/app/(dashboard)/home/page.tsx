import { delay } from "@/lib/async";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Greetings from "@/components/Greetings";
import GreetingsSkeleton from "@/components/GreetingsSkeleton";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import NewProject from "@/components/NewProject";

// would make sense to wrap this in a higher order function that checks auth
// because auth may need to be check many times
const getData = async () => {
    await delay(2000); // not needed, just to show loading
    // check that they are authenticated
    const user = await getUserFromCookie(cookies());
    // use prisma to find projects
    const projects = await db.project.findMany({
        where: {
            // make sure it is the owner who signed in
            ownerId: user?.id,
        },
        include: {
            tasks: true,
        },
        });
    return { projects };
};

export default async function Page() {
    const { projects } = await getData();
    // this return of jsx is completely blocked until projects is done above
    return (
        <div className="h-full overflow-y-auto pr-6 w-full">
            <div className=" h-full  items-stretch justify-center min-h-[content]">
                <div className="flex-1 grow flex">
                    {/* this Suspense also creates a delay in Greetings, which shows that we have control over what loads first */}
                    <Suspense fallback={<GreetingsSkeleton />}>
                        {/* @ts-expect-error Server Component */}
                        <Greetings />
                    </Suspense>
                </div>
                <div className="flex flex-2 grow items-center flex-wrap mt-3 -m-3 ">
                    {projects.map((project) => (
                        <div className="w-1/3 p-3" key={project.id}>
                            <Link href={`/project/${project.id}`}>
                                <ProjectCard project={project} />
                            </Link>
                        </div>
                    ))}
                    <div className="w-1/3 p-3"><NewProject /></div>
                </div>
                <div className="mt-6 flex-2 grow w-full flex">
                    {/* @ts-expect-error Server Component */}
                    <div className="w-full"><TaskCard /></div>
                </div>
            </div>
        </div>
    );
}