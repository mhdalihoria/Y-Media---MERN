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

    try {
      // 1. Get signature from your backend
      const { data: credentials } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/sign`
      );

      // 2. Prepare Cloudinary upload
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", credentials.upload_preset);
      formData.append("api_key", credentials.api_key);
      formData.append("timestamp", credentials.timestamp);
      formData.append("signature", credentials.signature);

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      // 3. Upload to Cloudinary
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${credentials.cloud_name}/image/upload`,
        formData
      );

      // 4. Save to your database
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/post`,
        {
          content: editor,
          img: res.data.secure_url,
        }
      );
      console.log(response.status, response.data);
    } catch (error) {
      console.error("Upload failed:", error);
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
