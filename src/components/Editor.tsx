import "quill/dist/quill.snow.css";

import {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    MutableRefObject,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Delta, Op } from "quill/core";
import Quill, { QuillOptions } from "quill";

import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { ImageIcon, Smile, X } from "lucide-react";

import { Hints } from "./Hints";
import { EmojiPopover } from "./EmojiPopover";
import { Button } from "@/components/ui/button";


type EditorValue = {
    body: string;
    image: File | null;
}

interface EditorProps {
    disabled?: boolean;
    placeholder?: string;
    onCancel?: () => void;
    defaultValue?: Delta | Op[];
    variant?: "create" | "update";
    innerRef?: MutableRefObject<Quill | null>;
    onSubmit: ({ image, body }: EditorValue) => void;
}

const Editor = ({
    onCancel,
    onSubmit,
    innerRef,
    disabled = false,
    defaultValue = [],
    variant = "create",
    placeholder = "Write your message here...",
}: EditorProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const submitRef = useRef(onSubmit);
    const disabledRef = useRef(disabled);
    const defaultValueRef = useRef(defaultValue);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageElRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        disabledRef.current = disabled;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
    })



    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                const text = quill.getText();
                                const addedImage = imageElRef.current?.files?.[0] || null;
                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                                if (isEmpty) return;

                                const body = JSON.stringify(quill.getContents());
                                submitRef.current({ body, image: addedImage });
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);

        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) container.innerHTML = "";
            if (quillRef.current) quillRef.current = null;
            if (innerRef) innerRef.current = null;
        };
    }, [innerRef]);

    // Remove html elements and check if the text is empty
    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    const toggleToolbarVisibility = () => {
        setIsToolbarVisible((c) => !c);
        const toolbarEl = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarEl) {
            toolbarEl.classList.toggle("hidden");
        }
    }

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
    }

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElRef}
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <div className="flex flex-col border border-neutral-800 rounded-md overflow-hidden focus-within:border-neutral-700 focus-within:ring-1 focus-within:ring-neutral-700 focus-within:shadow-sm transition bg-neutral-50 ">
                <div ref={containerRef} className="h-full ql-custom" />
                {!!image && (
                    <div className="p-2">
                        <div className="relative size-[62px] flex items-center justify-center group/image">
                            <Hints label="Remove Image">
                                <button
                                    onClick={() => {
                                        setImage(null);
                                        imageElRef.current!.value = "";
                                    }}
                                    className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                                >
                                    <X className="size-3.5 text-neutral-500 group-hover:text-neutral-600" />
                                    <span className="sr-only">Remove Image</span>
                                </button>
                            </Hints>
                            <Image
                                fill
                                alt="Uploaded Image"
                                src={URL.createObjectURL(image)}
                                className="rounded-xl overflow-hidden border object-cover"
                            />
                        </div>
                    </div>
                )}
                <div className="flex px-2 pb-2 z-[5]">
                    <Hints label={isToolbarVisible ? "Hide Formatting" : "Show Formatting"}>
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={disabled}
                            onClick={toggleToolbarVisibility}
                        >
                            <PiTextAa className="size-4" />
                            <span className="sr-only">Hide Formatting</span>
                        </Button>
                    </Hints>
                    <EmojiPopover
                        onEmojiSelect={onEmojiSelect}
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={false}
                        >
                            <Smile className="size-4" />
                            <span className="sr-only">Emoji</span>
                        </Button>
                    </EmojiPopover>
                    {variant === "create" && (
                        <Hints label="Image Insertion">
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={disabled}
                                onClick={() => imageElRef.current?.click()}
                            >
                                <ImageIcon className="size-4" />
                                <span className="sr-only">Image Insertion</span>
                            </Button>
                        </Hints>
                    )}
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-w">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={disabled}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                disabled={disabled || isEmpty}
                                onClick={() => {
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image
                                    })
                                }}
                                className="bg-[#007a5a] hover:bg-[#007a5a]/90 text-neutral-50"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {variant === "create" && (
                        <Button
                            size="iconSm"
                            onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image
                                })
                            }}
                            disabled={disabled || isEmpty}
                            className={cn("ml-auto",
                                isEmpty ?
                                    "bg-neutral-300 hover:bg-neutral-300 text-neutral-500" :
                                    "bg-[#007a5a] hover:bg-[#007a5a]/90 text-neutral-50"
                            )}
                        >
                            <MdSend className="size-4" />
                        </Button>
                    )}

                </div>
            </div>
            {variant === "create" && (
                <div className={cn("p-2 text-[10px] text-neutral-500 flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>
            )}

        </div>
    )
}

export default Editor;