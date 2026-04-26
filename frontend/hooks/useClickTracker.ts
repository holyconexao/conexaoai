"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function useClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track clicks in the CMS itself to avoid noise
    if (pathname.startsWith("/cms")) return;

    const handleClick = async (e: MouseEvent) => {
      // Calculate position as percentage of window to be responsive
      const x_percent = (e.clientX / window.innerWidth) * 100;
      const y_percent = (e.pageY / document.documentElement.scrollHeight) * 100;

      try {
        await fetch(`${API_URL}/cms/track-click/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            x_percent,
            y_percent,
          }),
        });
      } catch (error) {
        // Silent fail to not disturb user experience
        console.debug("Click tracking failed", error);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [pathname]);
}
