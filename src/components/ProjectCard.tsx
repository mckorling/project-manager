import { FC } from "react";
import { Prisma } from "@prisma/client";
import Card from "./Card";
import clsx from "clsx";

// Prisma has the typesafe info we need for a project
// validator: takes a genaric, like an argument for a type
// it takes Prisma.ProjectArgs
// ProjectArgs- arguments needed to make a Project (name, ownerId)
// ProjectArgs is generated from the schema
// use 'Project' because we have a Projects table
const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
    include: { tasks: true },
    // Projects has a relationship to Tasks
});

// typescript magic
type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

// there is a popular library with dates called moment.js (?)
// but it is too large and not really needed here
const formatDate = (date: string | number | Date) =>
    new Date(date).toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

// Functional Component
// all of this works means we don't need to write our own Project interface
// it's useful to do it this way because it will adapt to schema changes automatically
const ProjectCard: FC<{ project: ProjectWithTasks }> = ({ project }) => {
    // progress bar calculation for a project
    const completedCount = project.tasks.filter(
        (t) => t.status === "COMPLETED"
    ).length;
    const progress = Math.ceil((completedCount / project.tasks.length) * 100);

    return (
        <Card className="!px-6 !py-8 hover:scale-105 transition-all ease-in-out duration-200">
            <div>
                <span className="text-sm text-gray-300">
                {formatDate(project.createdAt)}
                </span>
            </div>
            <div className="mb-6">
                <span className="text-3xl text-gray-600">{project.name}</span>
            </div>
            <div className="mb-2">
                <span className="text-gray-400">
                {completedCount}/{project.tasks.length} completed
                </span>
            </div>
            <div>
                {/* background div that is 100% of the way*/}
                <div className="w-full h-2 bg-violet-200 rounded-full mb-2">
                {/* darker bar that shows percent completed */}
                {/* tailwind statically reads the classes so the width is handled in the style tag */}
                <div
                    className={clsx(
                    "h-full text-center text-xs text-white bg-violet-600 rounded-full"
                    )}
                    style={{ width: `${progress}%` }}
                ></div>
                </div>
                <div className="text-right">
                <span className="text-sm text-gray-600 font-semibold">
                    {progress}%
                </span>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;