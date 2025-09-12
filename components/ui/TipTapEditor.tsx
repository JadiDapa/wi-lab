/* --- NEW: tiptap imports --- */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Heading1,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "./button";
/* -------------------------- */

export function TiptapEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: true }),
      Underline,
      Placeholder.configure({ placeholder: "Description..." }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false, // ✅ SSR hydration fix
    editorProps: {
      handleDOMEvents: {
        mousedown: (view, event) => {
          const target = event.target as HTMLElement;
          // if click is inside the editor but not on a text node, focus and move cursor to end
          if (target.closest(".ProseMirror")) {
            if (view.state.selection.empty) {
              view.focus();
            }
          }
          return false; // allow default behavior too
        },
      },
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[200px] p-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // sync external value changes (e.g. form.reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (incoming !== current) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) return null;

  return (
    <div className="rounded border">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <Button
          size="sm"
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose h-full min-h-[200px] p-3"
      />
    </div>
  );
}
