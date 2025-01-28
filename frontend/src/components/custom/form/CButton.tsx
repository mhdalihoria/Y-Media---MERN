import { styled } from "@mui/material";
import Button from "@mui/material/Button";
import { CustomButtonProps } from "../formTypes";

const StyledButton = styled(Button, {
  // here, we select which props don't get passed down tot he underlying dom
  // intercepted props === props that we use for styling purposes
  shouldForwardProp: (prop) => prop !== "color" && prop !== "btnSize", // Filter out only 'color' and 'btnSize'
})<{ color?: "primary" | "secondary" | "accent"; btnSize?: "md" | "lg" }>( //We select exactly what props we allow, to loop through without problems
  ({ theme, color, btnSize }) => {
    // size styles definitions
    const sizeStyles = {
      md: {
        fontSize: "24px",
        padding: "20px 46px",
      },
      lg: {
        fontSize: "32.3px",
        padding: "27px 61px",
      },
    } as const;

    // button colors definitions
    const btnColors = {
      primary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
      secondary: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
      },
    };

    return {
      ...(color ? btnColors[color] : btnColors.primary), // Apply custom size styles
      ...(btnSize ? sizeStyles[btnSize] : sizeStyles.md), // Apply custom size styles
    };
  }
);

// CButton component to handle custom props and forward remaining ButtonProps
export const CButton = ({
  color = "primary",
  btnSize = "md",
  children,
  ...restProps
}: CustomButtonProps) => {
  return (
    <StyledButton
      color={color}
      btnSize={btnSize}
      variant="contained"
      {...restProps}
    >
      {children}
    </StyledButton>
  );
};
