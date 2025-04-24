import MeetingScheduler from "@/components/meeting-scheduler";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white ">
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
