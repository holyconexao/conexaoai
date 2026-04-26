"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function BehavioralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // We don't track clicks inside the CMS itself to avoid noise
    if (pathname.startsWith("/cms")) return;

    const handleGlobalClick = async (e: MouseEvent) => {
      // Calculate position relative to the document
      const x_percent = (e.pageX / document.documentElement.scrollWidth) * 100;
      const y_percent = (e.pageY / document.documentElement.scrollHeight) * 100;

      // Basic device/browser detection
      const screenWidth = window.innerWidth;
      const device_type = screenWidth < 768 ? "mobile" : screenWidth < 1024 ? "tablet" : "desktop";
      const userAgent = window.navigator.userAgent;
      const browser = userAgent.includes("Chrome") ? "Chrome" : userAgent.includes("Firefox") ? "Firefox" : "Safari";

      try {
        // Send to backend (public endpoint)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/cms/track-click/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            x_percent: parseFloat(x_percent.toFixed(2)),
            y_percent: parseFloat(y_percent.toFixed(2)),
            device_type,
            browser,
          }),
        });
      } catch (error) {
        // Silent fail for tracking
        console.warn("Analytics: Failed to track click", error);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [pathname]);

  return null;
}
