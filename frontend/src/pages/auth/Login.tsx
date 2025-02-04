import { useForm } from "react-hook-form";
import { CInputField } from "../../components/custom/form/CInputField";
import { CButton } from "../../components/custom/form/CButton";
import { z } from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";
import { Box } from "@mui/material";

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
  const [serverError, setServerError] = useState("");
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

      if (responseData.success) {
        setToken(responseData.token);
        setUser(responseData.userId);
      }
      console.log("Login successful:", response.data);
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
    </form>
  );
}
