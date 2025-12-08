import Hero from '@/components/Landing-page/Hero';
import NavBar from '@/components/Landing-page/NavBar';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <NavBar />
      {/*  */}
      <Hero />
    </main>
  );
}
