import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import DOMPurify from 'dompurify';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  LinkIcon,
  Unlink,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: string;
}

export function RichTextEditor({ value, onChange, placeholder, error }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-admin-accent hover:underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      });
      onChange(sanitized);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="space-y-2">
      <div className="bg-admin-surface border border-admin-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1 p-2 border-b border-admin-border bg-admin-surfaceLight flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('bold') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('italic') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('strike') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Strikethrough"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-admin-border mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-admin-border mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('bulletList') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('orderedList') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-admin-border mx-1" />

          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-admin-surface transition-colors ${
              editor.isActive('link') ? 'bg-admin-accent text-white' : 'text-admin-muted'
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={unsetLink}
            className="p-2 rounded hover:bg-admin-surface transition-colors text-admin-muted"
            title="Remove Link"
            disabled={!editor.isActive('link')}
          >
            <Unlink className="h-4 w-4" />
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="bg-admin-surface text-admin-white"
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="text-xs text-admin-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
