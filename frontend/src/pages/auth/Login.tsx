import { useForm } from "react-hook-form";
import { CInputField } from "../../components/custom/form/CInputField";
import { CButton } from "../../components/custom/form/CButton";
import { z } from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type ResponseData = {
  success: boolean;
  userId: string;
  token: string;
};

const errorMsg = {
  fontSize: "0.7rem",
  fontFamily: "Inter, Roboto",
  marginTop: "-1em",
  color: "#d32f2f",
};

export default function Login() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      const responseData = (await response.data) as ResponseData;

      if (!responseData.success) {
        throw new Error("Something Went Wrong...");
      }

      setToken(responseData.token);

      setUser(responseData.userId);

      setServerSuccess("Logged in Successfully | Redirecting ...");

      setTimeout(() => navigate("/"), 4000);
      // Redirect or show success message
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Login failed");
      } else {
        setServerError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (serverError) {
      setTimeout(() => {
        setServerError("");
        setServerSuccess("");
      }, 4000);
    }
  }, [serverError]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {serverError && (
        <Box
          sx={{
            background: (theme) => theme.palette.error.dark,
            margin: "1rem 0",
            padding: ".5em",
            borderRadius: "5px",
          }}
        >
          {serverError}
        </Box>
      )}
      {serverSuccess && (
        <Box
          sx={{
            background: (theme) => theme.palette.success.dark,
            margin: "1rem 0",
            padding: ".5em",
            borderRadius: "5px",
          }}
        >
          {serverSuccess}
        </Box>
      )}
      <CInputField
        label="Email"
        {...register("email")}
        disabled={isSubmitting}
      />
      {errors.email && <span style={errorMsg}>{errors.email.message}</span>}
      <CInputField
        label="Password"
        type="password"
        {...register("password")}
        disabled={isSubmitting}
      />
      {errors.password && (
        <span style={errorMsg}>{errors.password.message}</span>
      )}
      <CButton
        type="submit"
        btnSize="sm"
        disabled={isSubmitting}
        sx={{ marginTop: "1.5rem" }}
      >
        {isSubmitting ? "Logging In..." : "Login"}
      </CButton>
      <div
        style={{
          fontSize: ".8rem",
          marginTop: "-1em",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>No Account Yet?</span>
        <CButton
          variant="text"
          btnSize="xs"
          sx={{ padding: 0, width: "fit-content" }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </CButton>
      </div>
    </form>
  );
}
