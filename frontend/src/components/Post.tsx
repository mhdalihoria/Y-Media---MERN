import { useRef, useState } from "react";
import TextEditor from "./custom/form/editor/TextEditor";
import axios from "axios";
import { CButton } from "./custom/form/CButton";
import { BsCardImage } from "react-icons/bs";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";

export default function Post({
  userId,
  token,
}: {
  userId: string | null;
  token: string | null;
}) {
  const navigate = useNavigate();
  // ---------------------------------------------
  const [editor, setEditor] = useState(""); // Rich text content
  const [image, setImage] = useState<File | null>(null); // Uploaded image file
  const [uploading, setUploading] = useState(false); // Uploading state
  const [preview, setPreview] = useState<string | null>(null); // Image preview
  const fileInputRef = useRef<HTMLInputElement>(null); // File input ref

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file); // Set the selected image
      setPreview(URL.createObjectURL(file)); // Create a preview URL
    } else {
      setImage(null); // Clear the image if no file is selected
      setPreview(null); // Clear the preview
    }
  };

  // Handle post submission
  const uploadPost = async () => {
    if (!editor.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    setUploading(true);

    try {
      let img = null;

      // If an image is selected, upload it to Cloudinary
      if (image) {
        // Step 1: Get signature from your backend
        const { data: credentials } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/sign`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the auth token as a Bearer token
            },
          }
        );

        // Step 2: Prepare Cloudinary upload
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", credentials.upload_preset);
        formData.append("api_key", credentials.api_key);
        formData.append("timestamp", credentials.timestamp);
        formData.append("signature", credentials.signature);

        // Step 3: Upload to Cloudinary
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${credentials.cloud_name}/image/upload`,
          formData
        );
        img = res.data.secure_url; // Save the secure URL of the uploaded image
      }

      // Step 4: Send post data to the backend
      const postData = {
        content: editor,
        img: img || null, // Include the image URL if available, otherwise set to null
        user: userId,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/post`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the auth token as a Bearer token
          },
        }
      );

      alert("Post created successfully!");
      navigate(`/`);
    } catch (error) {
      console.error("Post creation failed:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        padding: "1rem",
      }}
    >
      {/* Rich Text Editor */}
      <TextEditor
        name="editor"
        value="<p>Start By Typing Some Text...</p>"
        onChange={setEditor}
      />

      {/* Image Upload Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        {/* Image Preview */}
        <Box>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                border: "3px solid #fdfdfd",
                borderRadius: "5px",
                background: "rgba(128,128,128, .2)",
                padding: ".5rem",
              }}
            />
          )}
        </Box>

        {/* File Input and Post Button */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }} // Hide the file input
          />

          {/* MUI Icon Button to Trigger File Input */}
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ width: "30px", height: "30px" }}
          >
            <BsCardImage />
          </IconButton>

          {/* Post Button */}
          <CButton
            onClick={uploadPost}
            disabled={editor.trim().length < 1 || uploading} // Disable if content is empty or uploading
            variant="contained"
            btnSize="xs"
          >
            Post
          </CButton>
        </Box>
      </Box>
    </Box>
  );
}
