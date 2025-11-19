import Home from "../components/landing/Home";
import About from "../components/landing/About";
import Dept from "../components/landing/Debt";
import Services from "../components/landing/Services";
import Contact from "../components/landing/Contact";
import Header from "../components/landing/Header";
import Footer from "../components/landing/Footer";

export default function Page() {
  return (
    <main>
      <Header />
      <Home />
      <About />
      <Dept />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
