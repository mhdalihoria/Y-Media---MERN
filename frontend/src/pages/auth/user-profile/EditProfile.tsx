import { useForm } from "react-hook-form";
import { z } from "zod";
import useUserStore from "../../../stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import axios from "axios";
import { CInputField } from "../../../components/custom/form/CInputField";
import { Alert, Box, styled } from "@mui/material";
import { CButton } from "../../../components/custom/form/CButton";
import { useAuthStore } from "../../../stores/authStore";
import DefaultUser from "../../../assets/default-user.jpg";
import { useNavigate } from "react-router";
import { useAlertStore } from "../../../stores/alertStore";
//----------------------------------------------------

const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: "2rem",
  "& .cover-img-container": {
    width: "100%",
    height: "250px",
    "& .cover-img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    "& .cover-img:hover": {
      filter: "brightness(50%)",
      cursor: "pointer",
    },
  },

  "& .profile-img-container": {
    width: "fit-content",
    display: "flex",
    justifyContent: "start",
    transform: "translateY(-50%)",
  },

  "& .profile-img": {
    width: "125px",
    height: "125px",
    objectFit: "cover",
    marginLeft: "1rem",
    borderRadius: "100%",
    border: `3px solid ${theme.palette.background.default}`,
  },

  "& .profile-img:hover": {
    filter: "brightness(50%)",
    cursor: "pointer",
  },

  "& .text-container": {
    margin: "-50px 1.5rem 0",

    "& h3": {
      fontWeight: 700,
      fontSize: "1.35rem",
    },
  },
}));
//----------------------------------------------------

//----------------------------------------------------

const editProfileSchema = z.object({
  bio: z.string().max(120, "Bio must be at most 120 characters"),
  profileImg: z.instanceof(File).optional(), // Optional file input
  coverImg: z.instanceof(File).optional(), // Optional file input
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;
//----------------------------------------------------

export default function EditProfile() {
  const {
    username,
    bio,
    coverImg,
    profileImg,
    setBio,
    setCoverImg,
    setProfileImg,
  } = useUserStore();
  const { token } = useAuthStore();
  const { status, message, setAlert } = useAlertStore();
  const navigate = useNavigate();
  //----------------------------------------------------
  const coverImgRef = useRef<HTMLInputElement>(null); // File input ref
  const profileImgRef = useRef<HTMLInputElement>(null); // File input ref
  //----------------------------------------------------
  const [coverImgPreview, setCoverImgPreview] = useState();
  const [profileImgPreview, setProfileImgPreview] = useState();
  const [loading, setLoading] = useState(false);
  //----------------------------------------------------
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
  //----------------------------------------------------

  // Handle form submission
  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
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

      if (status === "success") {
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to upload an image to Cloudinary
  const uploadImageToCloudinary = async (image: File): Promise<string> => {
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

      if (response.status !== 200) {
        throw new Error("Something Went Wrong. Try Again Later");
      }
      setAlert("success", "Profile Updated Successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert("error", "Failed to update profile. Please try again");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledHeaderContainer>
          <div className="cover-img-container">
            <img
              src={
                (coverImgPreview && URL.createObjectURL(coverImgPreview)) ||
                coverImg ||
                "https://placehold.co/600x400.png"
              }
              className="cover-img"
              onClick={() => coverImgRef.current?.click()}
            />
          </div>
          <div className="profile-img-container">
            <img
              src={
                (profileImgPreview && URL.createObjectURL(profileImgPreview)) ||
                profileImg ||
                DefaultUser
              }
              className="profile-img"
              onClick={() => profileImgRef.current?.click()}
            />
          </div>
          <div className="text-container">
            <h3>{username}</h3>
            <CInputField
              multiline
              rows={3}
              {...register("bio")}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />
          </div>
        </StyledHeaderContainer>

        <div>
          {/* Profile Image Upload */}
          <input
            type="file"
            accept="image/*"
            {...register("profileImg")} // Register the file input
            ref={profileImgRef}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfileImgPreview(file); // Update state with the selected file
              }
            }}
          />

          {/* Cover Image Upload */}
          <input
            type="file"
            accept="image/*"
            {...register("coverImg")} // Register the file input
            hidden
            ref={coverImgRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCoverImgPreview(file); // Update state with the selected file
              }
            }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ width: "100%", display: "flex" }}>
          <CButton
            type="submit"
            btnSize="sm"
            sx={{ width: "90%", margin: "auto" }}
            disabled={loading}
          >
            Save Changes
          </CButton>
        </div>
      </form>
    </div>
  );
}
