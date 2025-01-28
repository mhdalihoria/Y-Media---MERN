import { useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Focus from "@tiptap/extension-focus";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { common, createLowlight } from "lowlight";
import FontSizeExtension from "./FontSizeExtension";
import { IconButton } from "@mui/material";
import { BsTypeH1 } from "react-icons/bs";
import { BsTypeH2 } from "react-icons/bs";
import { BsTypeH3 } from "react-icons/bs";
import { BsTypeBold } from "react-icons/bs";
import { BsTypeItalic } from "react-icons/bs";
import { BsTypeUnderline } from "react-icons/bs";
import { LuAlignLeft } from "react-icons/lu";
import { LuAlignRight } from "react-icons/lu";
import { LuAlignCenter } from "react-icons/lu";
import { BsCardImage } from "react-icons/bs";
import { HiListBullet } from "react-icons/hi2";
import { RiListOrdered2 } from "react-icons/ri";
import { BiCodeBlock } from "react-icons/bi";
import { MdOutlineAddLink } from "react-icons/md";
// Syntax highlighting setup
const lowlight = createLowlight(common);

// Editor extensions
const extensions = [
  StarterKit,
  TextStyle,
  FontFamily,
  BulletList,
  CodeBlockLowlight.configure({ lowlight }),
  Color,
  Focus,
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  Image,
  Link,
  OrderedList,
  Paragraph,
  Placeholder.configure({ placeholder: "Start typing here..." }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Typography,
  Underline,
  FontSizeExtension,
];

const TextEditor = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: any;
}) => {
  const editor = useEditor({
    extensions,
    content: value, // Initialize with the current value
    onUpdate: ({ editor }) => {
      const content = editor.getHTML(); // Use editor.getText() for plain text
      onChange(content); // Pass the updated content to the parent
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || ""); // Sync only if there's a mismatch
    }
  }, [value, editor]);

  if (!editor) return null;

  const setFontSize = (size: string) => {
    editor.chain().focus().toggleMark("textStyle", { fontSize: size }).run();
  };

  const toolbarConfig = [
    {
      icon: <BsTypeH1 />, // Use an icon for headings
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      label: "H1",
    },
    {
      icon: <BsTypeH2 />, // Use an icon for headings
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      icon: <BsTypeH3 />, // Use an icon for headings
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      label: "H3",
    },
    {
      icon: <BsTypeBold />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: <BsTypeItalic />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: <BsTypeUnderline />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: <LuAlignLeft />,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
      label: "Left Align",
    },
    {
      icon: <LuAlignRight />,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      label: "Center Align",
    },
    {
      icon: <LuAlignCenter />,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      label: "Right Align",
    },
    {
      icon: <BsCardImage />,
      action: () =>
        editor
          .chain()
          .focus()
          .insertContent('<img src="https://placehold.co/600x400" />')
          .run(),
      label: "Insert Image",
    },
    {
      icon: <HiListBullet />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      label: "Bullet List",
    },
    {
      icon: <RiListOrdered2 />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      label: "Orderd List",
    },
    {
      icon: <BiCodeBlock />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      label: "Code Block",
    },
    {
      icon: <MdOutlineAddLink />,
      action: () => editor.chain().focus().setLink({ href: "https://example.com" }).run(),
      label: "Add Link",
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        {toolbarConfig.map((item, index) => (
          <IconButton
            key={index}
            onClick={item.action}
            style={{
              color: item.active ? "blue" : "black", // Highlight active buttons
            }}
            title={item.label} // Add a tooltip for accessibility
          >
            {item.icon}
          </IconButton>
        ))}
      </div>

      {/* TipTap Editor */}
      <EditorContent
        editor={editor}
        style={{ background: "#1d2733" }}
        name={name}
      />

      {/* Bubble Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </button>
        <button onClick={() => setFontSize("14px")}>14px</button>
        <button onClick={() => setFontSize("16px")}>16px</button>
        <button onClick={() => setFontSize("24px")}>24px</button>
      </BubbleMenu>
    </div>
  );
};

export default TextEditor;
