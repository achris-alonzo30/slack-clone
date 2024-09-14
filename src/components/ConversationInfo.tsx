import { 
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";

export const ConversationInfo = ({
    image,
    name = "Anonymous",
}: {
    name?: string;
    image?: string;
}) => {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <div className="flex items-center gap-x-1 mb-2">
                <Avatar className="size-14 mr-2 rounded-md">
                    <AvatarImage className="object-cover rounded-md" src={image} />
                    <AvatarFallback className="rounded-md text-sm font-medium text-neutral-300 bg-neutral-950">{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-2xl font-bold">{name}</p>
            </div>
            <p className="font-normal text-neutral-800 mb-4">
                This conversation is just between you and <strong>{name}</strong>.
            </p>
        </div>
    )
}