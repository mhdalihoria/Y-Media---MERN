import { useForm } from "react-hook-form";
import { z } from "zod";
import useUserStore from "../../../stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import axios from "axios";
import { CInputField } from "../../../components/custom/form/CInputField";
import { Box } from "@mui/material";
import { CButton } from "../../../components/custom/form/CButton";
import { useAuthStore } from "../../../stores/authStore";

const editProfileSchema = z.object({
  bio: z.string().max(120, "Bio must be at most 120 characters"),
  profileImg: z.instanceof(File).optional(), // Optional file input
  coverImg: z.instanceof(File).optional(), // Optional file input
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfile() {
  const { bio, coverImg, profileImg, setBio, setCoverImg, setProfileImg } =
    useUserStore();
  const { token } = useAuthStore();

  const coverImgRef = useRef<HTMLInputElement>(null); // File input ref
  const profileImgRef = useRef<HTMLInputElement>(null); // File input ref

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: bio || "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: EditProfileFormData) => {
    try {
      let uploadedProfileImg = profileImg; // Default to current profile image
      let uploadedCoverImg = coverImg; // Default to current cover image

      // Get the selected files from the refs
      const profileImgFile = profileImgRef.current?.files?.[0];
      const coverImgFile = coverImgRef.current?.files?.[0];

      // Upload profile image if provided
      if (profileImgFile) {
        uploadedProfileImg = await uploadImageToCloudinary(profileImgFile);
        setProfileImg(uploadedProfileImg); // Update global state
      }

      // Upload cover image if provided
      if (coverImgFile) {
        uploadedCoverImg = await uploadImageToCloudinary(coverImgFile);
        setCoverImg(uploadedCoverImg); // Update global state
      }

      // Update bio in global state
      if (data.bio !== bio) {
        setBio(data.bio);
      }

      await updateProfile(data.bio, uploadedProfileImg, uploadedCoverImg);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Helper function to upload an image to Cloudinary
  const uploadImageToCloudinary = async (image: File): Promise<string> => {
    console.log("uploadImageToCloudinary called with image:", image); // Add this line

    try {
      // Step 1: Get signature from your backend
      const { data: credentials } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/sign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use auth token
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

      console.log(res);
      return res.data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const updateProfile = async (
    bio: string | null,
    profileImg: string | null,
    coverImg: string | null
  ) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-profile`,
        { bio, profileImg, coverImg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log(data); // Handle success
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Bio Field */}
        <div>
          <label>Bio:</label>
          <CInputField
            multiline
            rows={3}
            {...register("bio")}
            error={!!errors.bio}
            helperText={errors.bio?.message}
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <h4>Profile Image:</h4>
          <input
            type="file"
            accept="image/*"
            {...register("profileImg")} // Register the file input
            ref={profileImgRef}
            hidden
          />
          <CButton
            onClick={() => profileImgRef.current?.click()}
            btnSize="xs"
            variant="outlined"
          >
            Upload
          </CButton>
        </div>

        {/* Cover Image Upload */}
        <div>
          <h4>Cover Image</h4>
          <input
            type="file"
            accept="image/*"
            {...register("coverImg")} // Register the file input
            hidden
            ref={coverImgRef}
          />
          <CButton
            onClick={() => coverImgRef.current?.click()}
            btnSize="xs"
            variant="outlined"
          >
            Upload
          </CButton>
        </div>

        {/* Submit Button */}
        <CButton type="submit">Save Changes</CButton>
      </form>
    </div>
  );
}

// const uploadPost = async () => {
//   if (!editor.trim()) {
//     alert("Content cannot be empty!");
//     return;
//   }

//   setUploading(true);

//   try {
//     let img = null;

//     // If an image is selected, upload it to Cloudinary
//     if (image) {
//       // Step 1: Get signature from your backend
//       const { data: credentials } = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/sign`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add the auth token as a Bearer token
//           },
//         }
//       );

//       // Step 2: Prepare Cloudinary upload
//       const formData = new FormData();
//       formData.append("file", image);
//       formData.append("upload_preset", credentials.upload_preset);
//       formData.append("api_key", credentials.api_key);
//       formData.append("timestamp", credentials.timestamp);
//       formData.append("signature", credentials.signature);

//       // Step 3: Upload to Cloudinary
//       const res = await axios.post(
//         `https://api.cloudinary.com/v1_1/${credentials.cloud_name}/image/upload`,
//         formData
//       );
//       img = res.data.secure_url; // Save the secure URL of the uploaded image
//     }

//     // Step 4: Send post data to the backend
//     const postData = {
//       content: editor,
//       img: img || null, // Include the image URL if available, otherwise set to null
//       user: userId,
//     };

//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/user/post`,
//       postData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Add the auth token as a Bearer token
//         },
//       }
//     );

//     console.log(response.status, response.data);
//     alert("Post created successfully!");
//   } catch (error) {
//     console.error("Post creation failed:", error);
//     alert("Failed to create post. Please try again.");
//   } finally {
//     setUploading(false);
//   }
// }
