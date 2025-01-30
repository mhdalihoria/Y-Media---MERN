import { ReactElement, useEffect, useState } from "react";
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
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { LuHeading } from "react-icons/lu";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";
import { LuHeading4 } from "react-icons/lu";
import { LuHeading5 } from "react-icons/lu";
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
import { BiFontFamily } from "react-icons/bi";
import { RiFontSize } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";
import { SketchPicker } from "react-color";
// --------------------------------------------------------------
const lowlight = createLowlight(common);

const StyledToolbar = styled(Box)(() => ({
  display: "flex",
  alignItems: "end",
  justifyContent: "center",
  gap: "8px",
}));

const StyledSelect = styled(Select)(() => ({
  "& .MuiSelect-select": {
    padding: "0 !important",
    fontSize: "1rem",
  },

  "& .MuiSelect-icon": {
    display: "none",
  },

  "& .MuiIconButton-root": {
    padding: 0,
  },
}));

const ToolbarIconBtns = styled(IconButton)(() => ({
  width: "35px",
  height: "35px",
}));
// -------------------------------------------------------------------
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

type HeadingLevel = 1 | 2 | 3 | 4 | 5;

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

  // ------------------------------------------------------

  const [headingLevel, setHeadingLevel] = useState<HeadingLevel | "">(
    editor.isActive("heading") ? editor.getAttributes("heading").level : ""
  );

  const [fontFamily, setFontFamily] = useState<string>("");

  const [showPicker, setShowPicker] = useState(false);

  const [fontSize, setFontSize] = useState<string>("");

  const handleFontSize = (event: SelectChangeEvent<unknown>) => {
    const size = event.target.value as string;

    editor.chain().focus().toggleMark("textStyle", { fontSize: size }).run();
    setFontSize(size);
  };

  const handleFontFamily = (event: SelectChangeEvent<unknown>) => {
    const family = event.target.value as string;

    editor.chain().focus().setFontFamily(family).run();
    setFontFamily(family);
  };

  const handleColorChange = (color: any) => {
    editor.chain().focus().setColor(color.hex).run();
  };

  const toolbarConfig = [
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
      icon: <LuAlignCenter />,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      label: "Center Align",
    },
    {
      icon: <LuAlignRight />,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      label: "Right Align",
    },

    {
      icon: <HiListBullet />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      label: "Bullet List",
    },
    {
      icon: <RiListOrdered2 />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      label: "Ordered List",
    },

    // {
    //   icon: <BsCardImage />,
    //   action: () =>
    //     editor
    //       .chain()
    //       .focus()
    //       .insertContent('<img src="https://placehold.co/600x400" />')
    //       .run(),
    //   label: "Insert Image",
    // },
    {
      icon: <BiCodeBlock />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      label: "Code Block",
    },
  ];

  const bubbleMenuConfig = [
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
      icon: <MdOutlineAddLink />,
      action: () =>
        editor.chain().focus().setLink({ href: "https://example.com" }).run(),
      label: "Add Link",
    },
  ];

  const headingOptions: {
    label: string;
    level: HeadingLevel;
    icon: ReactElement<any, any>;
  }[] = [
    { label: "H1", level: 1, icon: <LuHeading1 /> },
    { label: "H2", level: 2, icon: <LuHeading2 /> },
    { label: "H3", level: 3, icon: <LuHeading3 /> },
    { label: "H4", level: 4, icon: <LuHeading4 /> },
    { label: "H5", level: 5, icon: <LuHeading5 /> },
  ];

  const fontOptions = [
    "Inter",
    "Arial",
    "Serif",
    "Roboto",
    "Oswald",
    "Poppins",
  ];

  const sizeOptions = [
    "12px",
    "14px",
    "16px",
    "18px",
    "24px",
    "36px",
    "42px",
    "48px",
    "52px",
    "58px",
  ];

  const handleHeadingChange = (event: SelectChangeEvent<unknown>) => {
    const level =
      event.target.value === ""
        ? ""
        : (Number(event.target.value) as HeadingLevel);
    setHeadingLevel(level);

    if (level !== "") {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };
  return (
    <div>
      {/* Toolbar */}
      <StyledToolbar>
        {/* Render Dropdown for Headings */}
        <FormControl size="medium">
          <StyledSelect
            value={headingLevel}
            onChange={handleHeadingChange}
            displayEmpty
            style={{ minWidth: "35px", minHeight: "35px" }}
          >
            <MenuItem value="">
              <ToolbarIconBtns
                key={"header"}
                title={"Header"} // Add a tooltip for accessibility
              >
                <LuHeading />
              </ToolbarIconBtns>
            </MenuItem>
            {headingOptions.map((option) => (
              <MenuItem key={option.level} value={option.level}>
                {option.icon}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>

        <FormControl size="medium">
          <StyledSelect
            value={fontFamily}
            onChange={handleFontFamily}
            displayEmpty
            style={{ minWidth: "35px", minHeight: "35px" }}
          >
            <MenuItem value="">
              <ToolbarIconBtns key={"font"} title={"Font Family"}>
                <BiFontFamily />
              </ToolbarIconBtns>
            </MenuItem>
            {fontOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>

        {/* Render Other Buttons Dynamically */}
        {toolbarConfig.map((item, index) => (
          <ToolbarIconBtns
            key={index}
            onClick={item.action}
            style={{
              color: item.active ? "blue" : "black", // Highlight active buttons
            }}
            title={item.label} // Add a tooltip for accessibility
          >
            {item.icon}
          </ToolbarIconBtns>
        ))}
      </StyledToolbar>

      {/* TipTap Editor */}
      <EditorContent
        editor={editor}
        style={{ background: "transparent", padding: "1rem 2rem" }}
        name={name}
      />

      {/* Bubble Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <ToolbarIconBtns onClick={() => setShowPicker((prev) => !prev)}>
            <IoColorPaletteOutline />
          </ToolbarIconBtns>
          {showPicker && (
            <div
              style={{
                position: "absolute",
                top: "40px", // Position below button
                left: "0",
                zIndex: 999,
                backgroundColor: "#fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <SketchPicker
                color={"#fff"}
                onChangeComplete={handleColorChange}
              />
            </div>
          )}
        </Box>
        {bubbleMenuConfig.map((item, index) => (
          <ToolbarIconBtns
            key={index}
            onClick={item.action}
            style={{
              color: item.active ? "blue" : "black", // Highlight active buttons
            }}
            title={item.label} // Add a tooltip for accessibility
          >
            {item.icon}
          </ToolbarIconBtns>
        ))}

        <FormControl size="medium">
          <StyledSelect
            value={fontSize}
            onChange={handleFontSize}
            displayEmpty
            style={{ minWidth: "35px", minHeight: "35px" }}
          >
            <MenuItem value="">
              <ToolbarIconBtns key={"font-size"} title={"Font Size"}>
                <RiFontSize />
              </ToolbarIconBtns>
            </MenuItem>
            {sizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
      </BubbleMenu>
    </div>
  );
};

export default TextEditor;
