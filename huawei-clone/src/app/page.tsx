import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductLineup from "@/components/ProductLineup";
import FeatureHighlights from "@/components/FeatureHighlights";
import Specs from "@/components/Specs";
import Accessories from "@/components/Accessories";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductLineup />
        <FeatureHighlights />
        <Specs />
        <Accessories />
      </main>
      <Footer />
    </>
  );
}