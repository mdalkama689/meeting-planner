'use client'

import MeetingScheduler from "@/components/meeting-scheduler";
import MobileShare from "@/components/share/MobileShare";
import TabShare from "@/components/share/TabShare";
import { useEffect, useState } from "react";

export default function Home() {
    const [deviceType, setDeviceType] = useState<"big" | "small">("big");

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 1024 ? "small" : "big");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white ">
      {deviceType === "small" ? <MobileShare /> : <TabShare />}
      <div className="container mx-auto py-8 px-4 w-fit">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Global Meeting Scheduler</h1>
          <p className="text-gray-400">
            Find the perfect meeting time across different time zones
          </p>
        </header>
        <MeetingScheduler />
      </div>
    </div>
  );
}
