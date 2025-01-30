import {
  BoxProps,
  ButtonProps,
  SelectProps,
  TextFieldProps,
} from "@mui/material";
import { ReactNode } from "react";

//-------------------------------------------------------
//------------MUI Components Types-----------------------
//--------------------------------------------------start
export type BoxChildrenProps = BoxProps & {
  children: ReactNode;
};

export type CustomButtonProps = ButtonProps & {
  // Extending ButtonProps to inherit MUI Button's props
  color?: "primary" | "secondary" | "accent";
  btnSize?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode; // Children prop for button content
};

export type CustomInputFieldTypes = TextFieldProps & {
  fieldColor?: string;
};

export type CustomSelectFieldTypes = SelectProps & {
  fieldColor?: string;
  options: { value: string; name: string }[]; // The array of options for the select field
};
//-------------------------------------------------------
//------------MUI Components Types-----------------------
//----------------------------------------------------end
