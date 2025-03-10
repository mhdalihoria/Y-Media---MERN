import {
  Box,
  Container,
  IconButton,
  styled,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { GoHome } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import Logo from "../assets/dark-logo.svg";
import useUserStore from "../stores/userStore";

const StyledParentBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  background: theme.palette.background.default,
  color: theme.palette.text.primary,

  position: "relative",
}));

const StyledToolbar = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "45px",
  position: "fixed",
  bottom: 0,
  background: theme.palette.background.paper,

  boxShadow: "0px -1px 5px -3px rgba(204,204,204,1)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",

  "& .middle-icon": {
    background: theme.palette.primary.main,
    margin: "0 10px",
  },
}));

export default function HomeLayout() {
  const navigate = useNavigate();
  const { profileImg } = useUserStore();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  ); // Mobile devices
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  ); // Tablets
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md")); // Desktops

  const sideMenu = [
    { name: "Home", icon: <GoHome />, link: "/" },
    { name: "Search", icon: <IoIosSearch />, link: "/search" },
    { name: "Notifications", icon: <FaRegBell />, link: "/notifications" },
  ];

  const sideMenuItems = sideMenu.map((item) => (
    <div
      key={item.name}
      style={{
        display: "flex",
        gap: ".5rem",
        alignItems: "center",
        fontSize: "calc(1rem + .7vw)",
        marginBottom: "1.2em",
        marginLeft: ".5em",
        cursor: "pointer",
      }}
      onClick={() => navigate(item.link)}
    >
      {item.icon}
      <p style={{ fontFamily: "Inter", fontSize: "calc(1rem + .3vw)" }}>
        {item.name}
      </p>
    </div>
  ));

  return (
    <StyledParentBox>
      {isMobile && (
        <Container
          sx={{
            padding: "1rem",
            background: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.primary,
            paddingBottom: "6rem",
          }}
        >
          <Outlet />
          <StyledToolbar>
            <IconButton onClick={() => navigate("/")}>
              <GoHome />
            </IconButton>
            <IconButton onClick={() => navigate("/search")}>
              <IoIosSearch />
            </IconButton>
            <IconButton className="middle-icon" size="medium">
              <FaCirclePlus />
            </IconButton>
            <IconButton onClick={() => navigate("/notifications")}>
              <FaRegBell />
            </IconButton>
            <IconButton onClick={() => navigate("/profile")}>
              {profileImg ? (
                <img
                  src={profileImg}
                  width={"25px"}
                  height={"25px"}
                  style={{ borderRadius: "100%", objectFit: "cover" }}
                />
              ) : (
                <FiUser />
              )}
            </IconButton>
          </StyledToolbar>
        </Container>
      )}
      {isTablet && (
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "200px",
              paddingTop: "1.5rem",
              height: "100",
              paddingLeft: "1rem",
              background: (theme) => theme.palette.background.default,
            }}
          >
            {sideMenuItems}
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                alignItems: "center",
                fontSize: "calc(1rem + .7vw)",
                marginBottom: "1.2em",
                marginLeft: ".5em",
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  width={"25px"}
                  height={"25px"}
                  style={{ objectFit: "cover", borderRadius: "100%" }}
                />
              ) : (
                <FiUser />
              )}
              <p style={{ fontFamily: "Inter", fontSize: "calc(1rem + .3vw)" }}>
                Profile
              </p>
            </div>
          </Box>
          <Container
            maxWidth="sm"
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
              padding: "0!important",
            }}
          >
            <div style={{ paddingRight: "1.5rem" }}>
              <Outlet />
            </div>
          </Container>
        </Box>
      )}
      {isDesktop && (
        <Box
          sx={{
            display: "flex",
            background: (theme) => theme.palette.background.default,
            paddingBottom: "8rem",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "200px",
              paddingTop: "1.5rem",
              height: "100",
              paddingLeft: "2rem",
              background: (theme) => theme.palette.background.default,
            }}
          >
            <img
              src={Logo}
              width={"40px"}
              style={{ paddingLeft: ".8rem", marginBottom: "1.8rem" }}
            />
            {sideMenuItems}
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                alignItems: "center",
                fontSize: "calc(1rem + .7vw)",
                marginBottom: "1.2em",
                marginLeft: ".5em",
                cursor: "pointer",
              }}
              onClick={() => navigate("/profile")}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  width={"25px"}
                  height={"25px"}
                  style={{ objectFit: "cover", borderRadius: "100%" }}
                />
              ) : (
                <FiUser />
              )}
              <p style={{ fontFamily: "Inter", fontSize: "calc(1rem + .3vw)" }}>
                Profile
              </p>
            </div>
          </Box>
          <Container
            maxWidth="sm"
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
            }}
          >
            <Outlet />
          </Container>
        </Box>
      )}
    </StyledParentBox>
  );
}
