import { Box, Palette, styled, TextField, TextFieldProps } from "@mui/material";
import { CustomInputFieldTypes } from "../formTypes";
import React from "react";

const CustomInputField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fieldColor",
})<{ fieldColor: string }>(({ theme, fieldColor }) => {
  // Utility function to dynamically access the theme color using object path string
  const getColorFromTheme = (path: string) => {
    const keys = path.split("."); // Split the path like "primary.main" into ["primary", "main"]
    let color: Palette | string = theme.palette;
    keys.forEach((key) => {
      // Here's how we'll loop through the palette object
      // theme.palette["primary"]["main"]
      color = color[key as keyof typeof color];
    });
    return color;
  };

  const colorFromTheme = fieldColor
    ? getColorFromTheme(fieldColor)
    : theme.palette.primary.main;

  return {
    /*
        * .MuiInputLabel-root => style of the label of the text field.
        * .MuiInputLabel-root.Mui-focused => Controls the label's color when the input field is focused.
        * .MuiInputBase-input => Controls the color and style of the actual text entered inside the input field.
        * .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline => Controls the outline color and style when the text field is in its normal state.
        * .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline => Controls the outline color when the input field is focused.
        * .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline => Controls the outline color when hovering over the input field.    
        * .MuiInputBase-input::placeholder => Controls the style and color of the placeholder text inside the input field.
        * .MuiFormHelperText-root => Controls the color and style of the helper text displayed below the input field.
        * .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline => Controls the outline color when the input field has an error.
        * .MuiInputLabel-root.Mui-error => Controls the color of the label when the input field is in an error state.
        * .MuiFormHelperText-root.Mui-error => Controls the color of the helper text when there's an error.
        * .MuiInputBase-root.Mui-disabled => Controls the styles when the input is disabled.
        
        */

    // first way of doing it, more compact
    //   ".MuiInputLabel-root, .MuiInputLabel-root.Mui-focused, .MuiInputBase-input, .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, .MuiInputBase-input::placeholder, .MuiFormHelperText-root, .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline, .MuiInputLabel-root.Mui-error, .MuiFormHelperText-root.Mui-error, .MuiInputBase-root.Mui-disabled,.MuiInputAdornment-root, .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
    //     {
    //       color: `${fieldColor}`,
    //       borderColor: `${fieldColor}`,
    //     },

    // second way of doing it, more detailed
    "& .MuiInputLabel-root": {
      color: colorFromTheme,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colorFromTheme,
    },
    "& .MuiInputBase-input": {
      color: colorFromTheme,
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: colorFromTheme,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colorFromTheme,
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colorFromTheme,
    },
    "& .MuiInputBase-input::placeholder": {
      color: colorFromTheme,
    },
    "& .MuiFormHelperText-root": {
      color: colorFromTheme,
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: colorFromTheme,
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: colorFromTheme,
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: colorFromTheme,
    },
    "& .MuiInputBase-root.Mui-disabled": {
      color: colorFromTheme,
      backgroundColor: colorFromTheme,
    },
    "& .MuiInputAdornment-root": {
      color: colorFromTheme,
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: colorFromTheme,
    },
  };
});

const StyledLabel = styled("label", {
  shouldForwardProp: (prop) => prop !== "fieldColor",
})<{ fieldColor: string }>(({ theme, fieldColor }) => {
  // Utility function to dynamically access the theme color using object path string
  const getColorFromTheme = (path: string) => {
    const keys = path.split("."); // Split the path like "primary.main" into ["primary", "main"]
    let color: Palette | string = theme.palette;
    keys.forEach((key) => {
      // Here's how we'll loop through the palette object
      // theme.palette["primary"]["main"]
      color = color[key as keyof typeof color];
    });
    return color;
  };

  const colorFromTheme = fieldColor
    ? getColorFromTheme(fieldColor)
    : theme.palette.primary.main;

  return {
    color: colorFromTheme,
    fontSize: ".8rem",
    fontFamily: "Inter"
  };
});

type CInputFieldProps = CustomInputFieldTypes & TextFieldProps;

export const CInputField = React.forwardRef<HTMLInputElement, CInputFieldProps>(
  (
    {
      name,
      label,
      type,
      variant = "outlined",
      fieldColor = "primary.main",
      value,
      onChange,
      ...restProps
    }: CustomInputFieldTypes,
    ref
  ) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: ".3em" }}>
        <StyledLabel>{label}</StyledLabel>

        <CustomInputField
          name={name}
          type={type}
          variant={variant}
          fieldColor={fieldColor}
          value={value}
          onChange={onChange}
          {...restProps}
          // MUI's TextField accepts "inputRef" to attach a ref to the underlying <input> element.
          inputRef={ref}
        />
      </Box>
    );
  }
);

// export const CInputField = ({
//   name,
//   label,
//   type,
//   variant = "outlined",
//   fieldColor = "primary.main",
//   value = "", // Default to an empty string
//   onChange,
//   ...restProps
// }: CustomInputFieldTypes) => {
//   return (
//     <CustomInputField
//       name={name}
//       label={label}
//       type={type}
//       variant={variant}
//       fieldColor={fieldColor}
//       value={value}
//       onChange={onChange}
//       {...restProps}
//     />
//   );
// };
