"use client";

import { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";

interface Document {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useDocument(id?: string) {
  return useSWR<Document>(id && `/api/docs/${id}`, fetcher);
}

function DocumentHeader() {
  const params = useParams();
  const { data: document } = useDocument(params.id?.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(document?.title || "");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveDocument = useCallback(
    async (newTitle: string) => {
      if (!document) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);

      try {
        const response = await fetch(`/api/docs/${document.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        });

        if (response.ok) {
          const updatedDoc = await response.json();
          mutate(`/api/docs/${document.id}`, updatedDoc, false);
        }
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [document]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newTitle);
    }, 1000);
  };

  const handleSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveDocument(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <header className="bg-base-100 border-b border-base-300 sticky top-0 z-40">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Link href="/" className="btn btn-ghost btn-sm btn-circle">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-medium text-base-content bg-transparent border-none focus:outline-none focus:ring-0 w-full p-0 truncate"
                  placeholder="Untitled document"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-base-content/60">
              {isSaving && (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="btn btn-sm btn-primary"
              disabled={isSaving}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function headingLevel(editor: Editor) {
  if (editor.isActive("heading", { level: 1 })) return "1";
  if (editor.isActive("heading", { level: 2 })) return "2";
  if (editor.isActive("heading", { level: 3 })) return "3";
  return "0";
}

function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <div className="bg-base-100 border-b border-base-300 sticky top-16 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-2 py-3 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="btn btn-ghost btn-sm"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="btn btn-ghost btn-sm"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="divider divider-horizontal mx-2"></div>

          <select
            className="select select-bordered select-sm w-32"
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run();
              }
            }}
            value={headingLevel(editor)}
          >
            <option value="0">Normal</option>
            <option value="1">Title</option>
            <option value="2">Subtitle</option>
            <option value="3">Heading</option>
          </select>

          <div className="divider divider-horizontal mx-2"></div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`btn btn-sm ${
                editor.isActive("bold") ? "btn-primary" : "btn-ghost"
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`btn btn-sm ${
                editor.isActive("italic") ? "btn-primary" : "btn-ghost"
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`btn btn-sm ${
                editor.isActive("underline") ? "btn-primary" : "btn-ghost"
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="divider divider-horizontal mx-2"></div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`btn btn-sm ${
                editor.isActive("bulletList") ? "btn-primary" : "btn-ghost"
              }`}
              title="Bullet list"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`btn btn-sm ${
                editor.isActive("orderedList") ? "btn-primary" : "btn-ghost"
              }`}
              title="Numbered list"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentEditor() {
  const params = useParams();
  const { data: document } = useDocument(params.id?.toString());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(
    async (content: string) => {
      if (!document) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/docs/${document.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });

          if (response.ok) {
            const updatedDoc = await response.json();
            mutate(`/api/docs/${document.id}`, updatedDoc, false);
          }
        } catch (error) {
          console.error("Save failed:", error);
        }
      }, 1000);
    },
    [document]
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: document?.content || "<p>Start writing your document...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[calc(100vh-300px)] px-8 py-12 max-w-none prose prose-lg text-base-content",
      },
    },
    onUpdate: ({ editor }) => {
      saveContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-base-200">
      <DocumentHeader />
      <EditorToolbar editor={editor} />

      <main className="flex-1 bg-base-200">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-base-100 rounded-xl shadow-md border border-base-300 min-h-[calc(100vh-250px)]">
            <EditorContent
              editor={editor}
              className="prose prose-lg max-w-none w-full text-base-content"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="text-base-content">Loading document...</span>
      </div>
    </div>
  );
}

export default function DocumentPage() {
  const params = useParams();
  const { isLoading } = useDocument(params.id?.toString());

  if (isLoading || !document) {
    return <LoadingScreen />;
  }

  return <DocumentEditor />;
}
