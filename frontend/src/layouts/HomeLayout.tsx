import {
  Box,
  Container,
  IconButton,
  styled,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Outlet } from "react-router";
import { GoHome } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";

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
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  ); // Mobile devices
  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  ); // Tablets
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md")); // Desktops

  const sideMenu = [
    { name: "Home", icon: <GoHome />, link: "/" },
    { name: "Search", icon: <IoIosSearch />, link: "/" },
    { name: "Chat", icon: <IoChatbubbleEllipsesOutline />, link: "/" },
    { name: "Profile", icon: <FiUser />, link: "/" },
  ];

  return (
    <StyledParentBox>
      {isMobile && (
        <Container
          sx={{
            padding: 0,
            background: (theme) => theme.palette.background.default,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          <Outlet />
          <StyledToolbar>
            <IconButton>
              <GoHome />
            </IconButton>
            <IconButton>
              <IoIosSearch />
            </IconButton>
            <IconButton className="middle-icon" size="medium">
              <FaCirclePlus />
            </IconButton>
            <IconButton>
              <IoChatbubbleEllipsesOutline />
            </IconButton>
            <IconButton>
              <FiUser />
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
              paddingTop: "3rem",
              height: "100",
              background: (theme) => theme.palette.background.default,
            }}
          >
            {sideMenu.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  fontSize: "calc(1rem + .7vw)",
                  marginBottom: "1.2em",
                  marginLeft: ".5em",
                }}
              >
                {item.icon} <p>{item.name}</p>
              </div>
            ))}
          </Box>
          <Container
            maxWidth="sm"
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.primary,
              padding: "0!important",
            }}
          >
            <Outlet />
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
              paddingTop: "3rem",
              height: "100",
              background: (theme) => theme.palette.background.default,
            }}
          >
            {sideMenu.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  fontSize: "1.5rem",
                  marginBottom: "1.2em",
                  marginLeft: ".5em",
                }}
              >
                {item.icon} <p>{item.name}</p>
              </div>
            ))}
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
