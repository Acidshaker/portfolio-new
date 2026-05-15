import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const HEADER_HEIGHT = { xs: "56px", md: "64px" };

export default function MainLayout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box
        component="main"
        flex={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          "--header-height": HEADER_HEIGHT,
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
export { HEADER_HEIGHT };
