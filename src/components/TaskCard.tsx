import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { Task, TASK_STATUS } from "@prisma/client";
import { cookies } from "next/headers";
import Button from "./Button";
import Card from "./Card";

// Show next 5 due tasks, uncompleted
// this is not for finding/showing all tasks for a project
// this function is used to display on the home dashboard
const getData = async () => {
    const user = await getUserFromCookie(cookies());
    const tasks = await db.task.findMany({
        where: {
            ownerId: user?.id,
            NOT: {
                status: TASK_STATUS.COMPLETED,
                deleted: false,
            },
        },
        take: 5, // limit how many are taken
        orderBy: {
            due: "asc",
        },
    });

    return tasks;
};

// takes in tasks so that this componenet can be reused to show tasks when a project is selected
const TaskCard = async ({ title, tasks } : {
    title?: string,
    tasks?: Task[]
}) => {
    // if there are tasks passed in as prop, then it is used to display ALL tasks for a project
    // if not, it is for the dashboard and calls the above function
    const data = tasks || (await getData());

    return (
        <Card>
            <div className="flex justify-between items-center">
                <div>
                <span className="text-3xl text-gray-600">{title}</span>
                </div>
                <div>
                {/* button doesn't do anything yet */}
                <Button intent="text" className="text-violet-600">
                    + Create New
                </Button>
                </div>
            </div>
            <div>
                {data && data.length ? (
                    <div>
                        {data.map((task: Task) => (
                            <div className="py-2 " key={task.id}>
                                <div>
                                    <span className="text-gray-800">{task.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-sm">
                                        {task.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                <div>No tasks</div>
                )}
            </div>
        </Card>
    );
};

export default TaskCard;