import Hero from "@/components/Hero";
import StoriesHighlights from "@/components/StoriesHighlights";
import ProductCategories from "@/components/ProductCategories";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <StoriesHighlights />
      <ProductCategories />
      <About />
      <ContactForm />
    </>
  );
}
