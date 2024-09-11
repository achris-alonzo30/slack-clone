import { format } from "date-fns";

export const ChannelInfo = ({
    name,
    creationTime
} : {
    name: string;
    creationTime: number
}) => {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <p className="text-2xl font-bold flex items-center mb-2">
                # {name}
            </p>
            <p className="font-normal text-neutral-800 mb-4">
                This channel was created on {format(new Date(creationTime), "MMMM do, yyyy")}. This is the beginning of the <strong>{name}</strong> channel.
            </p>
        </div>
    )
}