import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function Features() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Built for Job Seekers Who Want Results
          </h2>
          <p className="text-muted-foreground">
            Resume Tailor combines advanced AI technology with proven job search
            strategies to help you create resumes that get noticed by both ATS
            systems and hiring managers.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <h3 className="text-sm font-medium">Lightning Fast</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your tailored resume in seconds, not hours. Upload, analyze,
              and download—all in under a minute.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="size-4" />
              <h3 className="text-sm font-medium">AI-Powered</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced AI analyzes job descriptions and optimizes your resume to
              match exactly what recruiters are looking for.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="size-4" />

              <h3 className="text-sm font-medium">ATS-Optimized</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Every resume passes through Applicant Tracking Systems with proper
              formatting and keyword optimization.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pencil className="size-4" />

              <h3 className="text-sm font-medium">Fully Customizable</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Review and edit AI suggestions to ensure your resume reflects your
              unique voice and experiences.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />

              <h3 className="text-sm font-medium">Complete Control</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You decide what stays and what goes. The AI assists, but you're
              always in the driver's seat.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />

              <h3 className="text-sm font-medium">Smart Matching</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get detailed match scores and insights showing how well your
              resume aligns with the job requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
