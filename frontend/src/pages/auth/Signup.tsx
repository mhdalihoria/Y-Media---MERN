import { useForm } from "react-hook-form";
import { CInputField } from "../../components/custom/form/CInputField";
import { CButton } from "../../components/custom/form/CButton";
import { z } from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Box } from "@mui/material";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router";

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

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

export default function Signup() {
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          username: data.username,
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

      setServerSuccess("Signed up Successfully | Redirecting ...");

      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Signup failed");
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
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
        label="username"
        {...register("username")}
        disabled={isSubmitting}
      />
      {errors.username && (
        <span style={errorMsg}>{errors.username.message}</span>
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

      <CInputField
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        disabled={isSubmitting}
      />
      {errors.confirmPassword && (
        <span style={errorMsg}>{errors.confirmPassword.message}</span>
      )}

      <CButton
        type="submit"
        disabled={isSubmitting}
        btnSize="sm"
        sx={{ marginTop: "1.5rem" }}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </CButton>
      <div
        style={{
          fontSize: ".8rem",
          marginTop: "-.6em",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Already Have an Account?</span>
        <CButton
          variant="text"
          btnSize="xs"
          onClick={() => navigate("/login")}
          sx={{ padding: 0, width: "fit-content" }}
        >
          Login
        </CButton>
      </div>
    </form>
  );
}
