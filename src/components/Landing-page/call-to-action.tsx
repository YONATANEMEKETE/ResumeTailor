import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mt-4">
            Let's transform your resume into a winning document with our AI
            optimization tool.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signin">
              <Button
                size="sm"
                className="from-primary via-primary/60 to-primary bg-transparent bg-linear-to-r bg-size-[200%_auto] hover:bg-transparent hover:bg-position-[99%_center] cursor-pointer text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 h-8 sm:h-9 md:h-10"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
