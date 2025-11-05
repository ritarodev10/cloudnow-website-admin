"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing your post...",
  className,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border border-input rounded-lg bg-background overflow-hidden",
        className
      )}
    >
      {/* Toolbar */}
      <div className="border-b border-input bg-muted/30 p-2 flex items-center gap-1 flex-wrap">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("bold") && "bg-accent"
          )}
          title="Bold"
        >
          <i className="ri-bold text-base" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("italic") && "bg-accent"
          )}
          title="Italic"
        >
          <i className="ri-italic text-base" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("strike") && "bg-accent"
          )}
          title="Strikethrough"
        >
          <i className="ri-strikethrough text-base" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("code") && "bg-accent"
          )}
          title="Code"
        >
          <i className="ri-code-line text-base" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Heading 1 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("heading", { level: 1 }) && "bg-accent"
          )}
          title="Heading 1"
        >
          <i className="ri-h-1 text-base" />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("heading", { level: 2 }) && "bg-accent"
          )}
          title="Heading 2"
        >
          <i className="ri-h-2 text-base" />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("heading", { level: 3 }) && "bg-accent"
          )}
          title="Heading 3"
        >
          <i className="ri-h-3 text-base" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("bulletList") && "bg-accent"
          )}
          title="Bullet List"
        >
          <i className="ri-list-unordered text-base" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("orderedList") && "bg-accent"
          )}
          title="Ordered List"
        >
          <i className="ri-list-ordered text-base" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("blockquote") && "bg-accent"
          )}
          title="Blockquote"
        >
          <i className="ri-double-quotes-l text-base" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Enter URL:", previousUrl || "");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else if (url === "") {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={cn(
            "p-2 rounded hover:bg-accent transition-colors",
            editor.isActive("link") && "bg-accent"
          )}
          title="Link"
        >
          <i className="ri-link text-base" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-2 rounded hover:bg-accent transition-colors"
          title="Image"
        >
          <i className="ri-image-line text-base" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
          title="Undo"
        >
          <i className="ri-arrow-go-back-line text-base" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-accent transition-colors disabled:opacity-50"
          title="Redo"
        >
          <i className="ri-arrow-go-forward-line text-base" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[400px] max-h-[600px] overflow-y-auto"
      />
    </div>
  );
}
