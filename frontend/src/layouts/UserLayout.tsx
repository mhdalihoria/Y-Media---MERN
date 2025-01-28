import { Box, styled } from "@mui/material";
import { Outlet } from "react-router";


const LayoutContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default, 
  width: "100vw",
  height: "100vh",
}))

export default function UserLayout() {
  return (
  <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  );
}
