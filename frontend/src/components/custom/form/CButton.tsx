import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import { CustomButtonProps } from "../formTypes";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => !["color", "btnSize"].includes(prop.toString()),
})<{
  color?: "primary" | "secondary" | "accent";
  btnSize?: "xs" | "sm" | "md" | "lg";
  variant?: "text" | "contained" | "outlined"; // Add variant to props
}>(({ theme, color = "primary", btnSize = "md", variant = "contained" }) => {
  const sizeStyles = {
    xs: { fontSize: "10px", padding: "6px 14px" },
    sm: { fontSize: "16px", padding: "13px 35px" },
    md: { fontSize: "24px", padding: "20px 46px" },
    lg: { fontSize: "32.3px", padding: "27px 61px" },
  };

  // Base styles for all variants
  const baseStyles = {
    ...sizeStyles[btnSize],
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: "8px",
    textTransform: "none" as const,
    transition: "all 0.3s ease",
  };

  // Variant-specific styles
  const variantStyles = {
    contained: {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText,
      "&:hover": {
        backgroundColor: theme.palette[color].dark,
      },
    },
    outlined: {
      border: `2px solid ${theme.palette[color].main}`,
      color: theme.palette[color].main,
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette[color].light + "15",
      },
    },
    text: {
      color: theme.palette[color].main,
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],

    // Disabled state styles
    "&.Mui-disabled": {
      ...(variant === "contained" && {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      }),
      ...(variant === "outlined" && {
        borderColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      }),
      ...(variant === "text" && {
        color: theme.palette.action.disabled,
      }),
    },
  };
});

export const CButton = ({
  color = "primary",
  btnSize = "md",
  variant = "contained",
  children,
  ...restProps
}: CustomButtonProps) => {
  return (
    <StyledButton
      color={color}
      btnSize={btnSize}
      variant={variant}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};
