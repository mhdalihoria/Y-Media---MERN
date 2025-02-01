import { useForm } from "react-hook-form";
import { CInputField } from "../../components/custom/form/CInputField";
import { CButton } from "../../components/custom/form/CButton";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {serverError && <p>{serverError}</p>}

        <CInputField
          label="Email"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <CInputField
          label="Password"
          type="password"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <CButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Login"}
        </CButton>
      </form>
    </div>
  );
}
