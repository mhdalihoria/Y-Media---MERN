import { useState } from "react";
import TextEditor from "./custom/form/editor/TextEditor";
import axios from "axios";

export default function Post() {
  const [editor, setEditor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Preview before uploading
    }
  };
  const uploadImage = async () => {
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;
      console.log("Upload success:", imageUrl);

      // Send to your backend here
      // await axios.post('/your-backend-endpoint', { imageUrl });
    } catch (error: any) {
      console.error("Upload failed:", error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <TextEditor
        name="editor"
        value="<p>Start By Typing Some Text...</p>"
        onChange={setEditor}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img src={preview} alt="Preview" style={{ width: "100px" }} />
      )}
      <button onClick={uploadImage} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
