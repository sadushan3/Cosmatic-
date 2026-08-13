import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import React from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter product description...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || `<p>${placeholder}</p>`,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div style={{ border: '1px solid #E0D9CF', borderRadius: 4 }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: 12,
          borderBottom: '1px solid #E0D9CF',
          background: '#FEFDFB',
        }}
      >
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
          label="B"
          style={{ fontWeight: 'bold' }}
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
          label="I"
          style={{ fontStyle: 'italic' }}
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
          label="U"
          style={{ textDecoration: 'underline' }}
        />

        <div style={{ width: 1, background: '#E0D9CF', margin: '0 4px' }} />

        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading"
          label="H2"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Subheading"
          label="H3"
        />

        <div style={{ width: 1, background: '#E0D9CF', margin: '0 4px' }} />

        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
          label="•"
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
          label="1."
        />

        <div style={{ width: 1, background: '#E0D9CF', margin: '0 4px' }} />

        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
          label="⬅"
        />
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
          label="↔"
        />
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
          label="➡"
        />

        <div style={{ width: 1, background: '#E0D9CF', margin: '0 4px' }} />

        <ToolButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          title="Clear Formatting"
          label="✕"
        />
      </div>

      {/* Editor */}
      <div style={{ padding: 16, minHeight: 200 }}>
        <EditorContent
          editor={editor}
          style={{
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: 1.6,
            color: '#1C1916',
          }}
        />
      </div>
    </div>
  )
}

interface ToolButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  label: string
  style?: React.CSSProperties
}

function ToolButton({ onClick, isActive, title, label, style }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '6px 10px',
        fontSize: 12,
        fontWeight: 500,
        border: `1px solid ${isActive ? '#1C1916' : '#D4CCBF'}`,
        background: isActive ? '#1C1916' : '#FEFDFB',
        color: isActive ? '#FEFDFB' : '#1C1916',
        cursor: 'pointer',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        ...style,
      }}
      type="button"
    >
      {label}
    </button>
  )
}
