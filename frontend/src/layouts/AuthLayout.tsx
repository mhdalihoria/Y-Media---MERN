import { Box, Container, Divider, Paper, styled } from "@mui/material";
import { Outlet } from "react-router";
import Logo from "../assets/dark-logo.svg";

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
  borderRadius: "15px",
}));

export default function AuthLayout() {
  return (
    <ParentContainerStyled>
      <ChildContainerStyled maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "translateY(-40%)"
          }}
        >
          <img src={Logo} style={{ width: "60px" }} />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ opacity: 1, margin: "0 1rem" }}
          />
          <div>
            <h3>Discover</h3>
            <h3>Everything</h3>
          </div>
        </Box>
        <Outlet></Outlet>
      </ChildContainerStyled>
    </ParentContainerStyled>
  );
}
