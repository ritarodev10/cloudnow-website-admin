"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to all-post page
    router.replace("/blog/all-post");
  }, [router]);

  return null; // This component doesn't render anything
}
