import { Box, Container } from "@mui/material";
import HeroSection from "@/sections/HeroSection";

export default function Home() {
  return (
    <Box>
      <Container maxWidth="lg">
        <HeroSection />
      </Container>
    </Box>
  );
}
