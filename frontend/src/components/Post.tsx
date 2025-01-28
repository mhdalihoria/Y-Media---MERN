import { useState } from "react";
import TextEditor from "./custom/form/editor/TextEditor";

export default function Post() {
  const [editor, setEditor] = useState("");

  console.log(editor);

  return (
    <div>
      <TextEditor
        name="editor"
        value="<p>Start By Typing Some Text...</p>"
        onChange={setEditor}
      />
    </div>
  );
}
