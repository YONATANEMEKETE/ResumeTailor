import Cta from '@/components/Landing-page/Cta';
import Features from '@/components/Landing-page/Features';
import Footer from '@/components/Landing-page/Footer';
import Hero from '@/components/Landing-page/Hero';
import NavBar from '@/components/Landing-page/NavBar';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <NavBar />
      {/*  */}
      <Hero />
      <Features />
      <Cta />
      <Footer />
    </main>
  );
}
