import { Box, Container, Paper, styled } from "@mui/material";
import { Outlet } from "react-router";

const ParentContainerStyled = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  minWidth: "100vw",
  background: theme.palette.background.default,
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ChildContainerStyled = styled(Container)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: "4rem",
  borderRadius: "15px"
}));

export default function AuthLayout() {
  return (
    <ParentContainerStyled>
      <ChildContainerStyled maxWidth="xs">
        <Outlet></Outlet>
      </ChildContainerStyled>
    </ParentContainerStyled>
  );
}
