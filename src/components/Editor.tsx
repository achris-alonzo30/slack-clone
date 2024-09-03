import "quill/dist/quill.snow.css";

import { useEffect, useRef } from "react";
import Quill, { QuillOptions } from "quill";

import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";




const Editor = () => {
    const quillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!quillRef.current) return;

        const container = quillRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options: QuillOptions = {
            theme: "snow",

        };

        const quill = new Quill(editorContainer, options);

        return () => {
            if (container) container.innerHTML = "";
        };
    }, []);


    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-neutral-800 rounded-md overflow-hidden focus-within:border-neutral-700 focus-within:ring-1 focus-within:ring-neutral-700 focus-within:shadow-sm transition bg-neutral-50 ">
                <div ref={quillRef} className="h-full ql-custom" />
                <div className="flex px-2 pb-2 z-[5]">
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={false}
                        onClick={() => { }}
                    >
                        <PiTextAa className="size-4" />
                        <span className="sr-only">Text Formatting</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={false}
                        onClick={() => { }}
                    >
                        <Smile className="size-4" />
                        <span className="sr-only">Emoji</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={false}
                        onClick={() => { }}
                    >
                        <ImageIcon className="size-4" />
                        <span className="sr-only">Image Insertion</span>
                    </Button>
                    <Button className="ml-auto">
                        <MdSend className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Editor;