/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Code2,
  Construction,
  Rocket,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  title?: string;
  message?: string;
}

export function ComingSoon({ title, message }: ComingSoonProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const pageName =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].replace(/-/g, " ")
      : "This page";

  const pageTitle =
    title || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
  const pageMessage =
    message ||
    "This section is currently under development. Check back soon for updates!";

  // For the progress animation
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(65); // Animate to 65% progress
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Icon with glow effect */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-150" />
          <div className="bg-primary/20 p-6 rounded-full text-primary">
            <Construction className="size-16" />
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          {pageTitle} Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          {pageMessage}
        </p>

        {/* Progress card */}
        <Card className="mb-8 border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <div className="bg-transparent text-primary">
                  <Sparkles className="size-4" />
                </div>
                Development Progress
              </h3>
              <span className="text-sm font-medium">{progress}%</span>
            </div>

            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <CalendarClock className="size-5" />
              </div>
              <div>
                <h4 className="font-medium">Estimated Completion</h4>
                <p className="text-sm text-muted-foreground">
                  We're working hard to bring you this feature as soon as
                  possible.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Code2 className="size-5" />
              </div>
              <div>
                <h4 className="font-medium">Developer Note</h4>
                <p className="text-sm text-muted-foreground">
                  "I'm currently implementing this feature and it will be
                  available soon. In the meantime, you can explore the Blog
                  Posts section which is already functional!"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="gap-2">
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/content/blog-posts" passHref>
            <Button className="gap-2">
              Explore Blog Posts
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Animated icons */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-between opacity-10 pointer-events-none">
          <Rocket
            className="size-20 animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <Construction
            className="size-16 animate-bounce"
            style={{ animationDuration: "2.5s", animationDelay: "0.2s" }}
          />
          <Sparkles
            className="size-12 animate-pulse"
            style={{ animationDuration: "2s" }}
          />
        </div>
      </div>
    </div>
  );
}
