"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { MediaPickerDialog } from "@/components/admin/MediaPicker";
import { cn } from "@/lib/utils";

function Btn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded p-2 transition-colors",
        active ? "bg-ink text-white" : "text-ink-soft hover:bg-paper-2",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image,
      Placeholder.configure({ placeholder: "Begin the story…" }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "article-body max-w-none px-6 py-5 focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex min-h-[420px] items-center justify-center border border-rule bg-white">
        <div className="relative h-px w-20 overflow-hidden rounded-full bg-rule">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-loader-slide rounded-full bg-ink" />
        </div>
      </div>
    );
  }

  const words = editor.storage.characterCount.words();

  return (
    <div className="border border-rule bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-rule bg-white px-2 py-1.5">
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Btn>
        <span className="mx-1 h-5 w-px bg-rule" />
        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="Section heading"
        >
          <Heading2 className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="Sub-heading"
        >
          <Heading3 className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Pull quote"
        >
          <Quote className="h-4 w-4" />
        </Btn>
        <span className="mx-1 h-5 w-px bg-rule" />
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          <List className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label="Section break"
        >
          <Minus className="h-4 w-4" />
        </Btn>
        <span className="mx-1 h-5 w-px bg-rule" />
        <Btn onClick={setLink} active={editor.isActive("link")} label="Link">
          <Link2 className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => setPickerOpen(true)} label="Insert image">
          <ImageIcon className="h-4 w-4" />
        </Btn>
        <span className="mx-1 h-5 w-px bg-rule" />
        <Btn onClick={() => editor.chain().focus().undo().run()} label="Undo">
          <Undo2 className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} label="Redo">
          <Redo2 className="h-4 w-4" />
        </Btn>
        <span className="ml-auto pr-2 font-sans text-[0.72rem] tabular-nums text-muted">
          {words.toLocaleString()} words · {Math.max(1, Math.round(words / 220))} min read
        </span>
      </div>

      <EditorContent editor={editor} />

      {pickerOpen ? (
        <MediaPickerDialog
          onClose={() => setPickerOpen(false)}
          onSelect={(asset) => {
            editor
              .chain()
              .focus()
              .setImage({ src: asset.url, alt: asset.alt || "" })
              .run();
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
