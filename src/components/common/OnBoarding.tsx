'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { completeOnboarding } from '@/actions/user';
import Image from 'next/image';

function OnBoarding() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(true);

  const stepContent = [
    {
      title: 'Upload Your Resume',
      description:
        'Start by uploading your current resume. We only support PDF',
    },
    {
      title: 'Tailor for the Job',
      description:
        'Paste the job description you want to apply for. Our AI will optimize your resume to match the requirements.',
    },
    {
      title: 'Export and Apply',
      description:
        'Download your perfectly tailored resume and increase your chances of getting hired.',
    },
  ];
  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    setOpen(false);
    await completeOnboarding();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2">
          <Image
            className="w-full rounded-lg"
            src="/og-image.png"
            width={382}
            height={216}
            alt="dialog"
          />
        </div>
        <div className="space-y-6 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full bg-primary',
                    index + 1 === step ? 'bg-primary' : 'opacity-20'
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleFinish}>
                Skip
              </Button>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
                  Next
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button type="button" onClick={handleFinish}>
                  Okay
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { OnBoarding };
