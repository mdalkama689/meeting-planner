"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  timeZone: string;
  availableFrom: string;
  availableTo: string;
}

interface TimeSlotGridProps {
  participants: Participant[];
}

export default function TimeSlotGrid({ participants }: TimeSlotGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isAvailable = (participant: Participant, hour: string) => {
    const slotMinutes = timeToMinutes(hour);
    const fromMinutes = timeToMinutes(participant.availableFrom);
    const toMinutes = timeToMinutes(participant.availableTo);

    if (fromMinutes < toMinutes) {
      return slotMinutes >= fromMinutes && slotMinutes < toMinutes;
    } else {
      return slotMinutes >= fromMinutes || slotMinutes < toMinutes;
    }
  };

  const isCommonAvailable = (hour: string) => {
    return participants.every((participant) => isAvailable(participant, hour));
  };

  const getUtcOffsetHours = (timezone: string) => {
    const match = timezone.match(/UTC([+-])(\d+):(\d+)/);
    if (!match) return 0;

    const sign = match[1] === "+" ? 1 : -1;
    const hours = Number.parseInt(match[2], 10);
    const minutes = Number.parseInt(match[3], 10) / 60;

    return sign * (hours + minutes);
  };

  const convertTime = (
    hour: string,
    fromUtcOffset: number,
    toUtcOffset: number
  ) => {
    const [h, m] = hour.split(":").map(Number);
    let newHour = h + (toUtcOffset - fromUtcOffset);

    if (newHour < 0) newHour += 24;
    if (newHour >= 24) newHour -= 24;

    return `${newHour.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  const getLocalTime = (hour: string, participantTimezone: string) => {
    const utcOffset = getUtcOffsetHours(participantTimezone);
    return convertTime(hour, 0, utcOffset);
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[500px] rounded-md border border-gray-700">
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-900 z-10">
              <tr>
                <th className="p-3 text-left border-b border-gray-700 min-w-[120px]">
                  UTC Time
                </th>
                {participants.map((participant) => (
                  <th
                    key={participant.id}
                    className="p-3 text-left border-b border-gray-700 min-w-[150px]"
                  >
                    {participant.name || "Unnamed"}
                    <span className="block text-xs text-gray-400">
                      {participant.timeZone}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => {
                const commonAvailable = isCommonAvailable(hour);
                return (
                  <tr
                    key={hour}
                    className={cn(
                      "hover:bg-gray-700/50",
                      commonAvailable && "bg-green-900/20"
                    )}
                  >
                    <td className="p-3 border-b border-gray-700 font-medium">
                      {hour}
                    </td>
                    {participants.map((participant) => {
                      const localTime = getLocalTime(
                        hour,
                        participant.timeZone
                      );
                      const available = isAvailable(participant, hour);
                      return (
                        <td
                          key={`${participant.id}-${hour}`}
                          className={cn(
                            "p-3 border-b border-gray-700",
                            available ? "text-green-400" : "text-gray-500"
                          )}
                        >
                          {localTime}
                          {available && <span className="ml-2">✓</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hours
          .filter((hour) => isCommonAvailable(hour))
          .map((hour) => (
            <Card key={hour} className="p-4 bg-green-900/20 border-green-900/50">
              <div className="font-medium">UTC {hour}</div>
              <div className="text-sm text-gray-400 mt-1">
                {participants.map((p) => (
                  <div key={`${p.id}-${hour}-card`}>
                    {p.name}: {getLocalTime(hour, p.timeZone)}
                  </div>
                ))}
              </div>
            </Card>
          ))}
      </div> */}
    </div>
  );
}
