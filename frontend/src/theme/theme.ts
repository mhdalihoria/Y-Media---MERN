import { createTheme } from "@mui/material/styles";
import { themeColors } from "./themeColors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#20a0f2",
    },
    secondary: {
      main: "#13171a",
    },
    background: {
      default: "#000000",
      paper: "#14171a",
    },
    text: {
      primary: "#e1e8ed",
      secondary: "#E1E8ED",
    },
    ...themeColors,
  },
});

export default theme;
