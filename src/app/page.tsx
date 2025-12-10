import Features from '@/components/Landing-page/Features';
import Footer from '@/components/Landing-page/Footer';
import Hero from '@/components/Landing-page/Hero';
import NavBar from '@/components/Landing-page/NavBar';
import CallToAction from '@/components/Landing-page/call-to-action';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/chat');
  }

  return (
    <main className="min-h-screen w-full bg-background">
      <NavBar />
      {/*  */}
      <Hero />
      <Features />
      {/* <Cta /> */}
      <CallToAction />
      <Footer />
    </main>
  );
}
