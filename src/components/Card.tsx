import clsx from "clsx";

const Card = ({ className, children } : {
    className: string,
    children: any 
}) => {
    return (
        <div
        className={clsx(
            "rounded-3xl px-10 py-4 drop-shadow-xl bg-white",
            className
        )}
        >
        {children}
        </div>
    );
};

export default Card;