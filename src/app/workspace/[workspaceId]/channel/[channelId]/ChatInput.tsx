import Quill from "quill";
import { useRef } from "react";
import dynamic from "next/dynamic";


const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export const ChatInput = ({
    placeholder
} : {
    placeholder: string;
}) => {
    const innerRef = useRef<Quill | null>(null);

    const handleSubmit = ({
        body,
        image
    }: {
        body: string;   
        image: File | null;
    }) => {

    }

    return (
        <div className="px-5 w-full">
            <Editor 
                disabled={false}
                innerRef={innerRef}
                onSubmit={handleSubmit}
                placeholder={placeholder}
            />
        </div>
    )
}