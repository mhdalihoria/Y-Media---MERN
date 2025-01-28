import {
  Palette,
  styled,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { CustomSelectFieldTypes } from "../formTypes";

// Custom Select Field Component
const CustomSelectField = styled(Select, {
  shouldForwardProp: (prop) => prop !== "fieldColor",
})<{ fieldColor: string }>(({ theme, fieldColor }) => {
  // Utility function to dynamically access the theme color using object path string
  const getColorFromTheme = (path: string) => {
    const keys = path.split("."); // Split the path like "primary.main" into ["primary", "main"]
    let color: Palette | string = theme.palette;
    keys.forEach((key) => {
      // Loop through the palette object, e.g. theme.palette["primary"]["main"]
      color = color[key as keyof typeof color];
    });
    return color;
  };

  const colorFromTheme = fieldColor
    ? getColorFromTheme(fieldColor)
    : theme.palette.primary.main;

  return {
    "& .MuiInputLabel-root": {
      color: colorFromTheme,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colorFromTheme,
    },
    "& .MuiSelect-root": {
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
    "& .MuiSelect-icon": {
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
  };
});

export const CSelectField = ({
  //   name,
  //   label,
  //   options = [],
  //   variant = "outlined",
  //   fieldColor = "primary.main",
  //   ...restProps
  // }: {
  //   name: string;
  //   label: string;
  //   options: { value: string; name: string }[]; // Array of objects with value and name
  //   variant?: "outlined" | "filled" | "standard";
  //   fieldColor?: string;
  // }) => {
  name,
  label,
  options,
  variant = "outlined",
  fieldColor = "primary.main",
  ...restProps
}: CustomSelectFieldTypes) => {
  return (
    <FormControl fullWidth variant={variant}>
      <InputLabel id={`${name}-label`} style={{ color: fieldColor }}>
        {label}
      </InputLabel>
      <CustomSelectField
        name={name}
        labelId={`${name}-label`}
        fieldColor={fieldColor}
        {...restProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </CustomSelectField>
    </FormControl>
  );
};
