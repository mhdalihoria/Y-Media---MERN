import { useRef, useState } from "react";
import TextEditor from "./custom/form/editor/TextEditor";
import axios from "axios";
import { CButton } from "./custom/form/CButton";
import { BsCardImage } from "react-icons/bs";
import { Box, IconButton } from "@mui/material";

export default function Post() {
  const [editor, setEditor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <Box
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <TextEditor
        name="editor"
        value="<p>Start By Typing Some Text...</p>"
        onChange={setEditor}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          margin: "2rem",
        }}
      >
        <Box>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "cover",
                border: "3px solid #fdfdfd",
                borderRadius: "5px",
                background: "rgba(128,128,128, .2)",
                padding: ".5rem"
              }}
            />
          )}
        </Box>
        <Box sx={{ transform: "translateY(-13px)" }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }} // Hides the file input
          />

          {/* MUI Icon Button to Trigger File Input */}
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ width: "30px", height: "30px" }}
          >
            <BsCardImage />
          </IconButton>

          <CButton
            onClick={uploadImage}
            disabled={uploading}
            variant="contained"
            btnSize="xs"
            sx={{ marginLeft: "20px" }}
          >
            {/* {uploading ? "Posting..." : "Post"} */}
            Post
          </CButton>
        </Box>
      </Box>
    </Box>
  );
}
