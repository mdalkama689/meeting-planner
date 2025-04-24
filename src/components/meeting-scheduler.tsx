"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import TimeSlotGrid from "./time-slot-grid";
import { TimeZoneSelect } from "./TimeZoneSelect";

const CITY_TIME_ZONES = [
  { name: "New York", zone: "America/New_York" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "London", zone: "Europe/London" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Mumbai", zone: "Asia/Kolkata" },
  { name: "Singapore", zone: "Asia/Singapore" },
];

const TIME_ZONES =
  typeof Intl !== "undefined" && Intl.supportedValuesOf
    ? Intl.supportedValuesOf("timeZone")
    : [
        "UTC",
        "Asia/Kolkata",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
        "Asia/Dubai",
        "America/Los_Angeles",
      ];

interface Participant {
  id: string;
  name: string;
  timeZone: string;
  availableFrom: string;
  availableTo: string;
}

export default function MeetingScheduler() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "You",
      timeZone: "UTC",
      availableFrom: "09:00",
      availableTo: "17:00",
    },
  ]);
  const [showResults, setShowResults] = useState(false);

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: "",
      timeZone: "UTC",
      availableFrom: "09:00",
      availableTo: "17:00",
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (
    id: string,
    field: keyof Participant,
    value: string
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const findCommonTimes = () => {
    setShowResults(true);
  };

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="rounded-md shadow-md bg-gray-900 border border-gray-800 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
          Participants & Availability
        </h2>
        <div className="space-y-4 md:space-y-6">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className="rounded-md bg-gray-800 border border-gray-700 p-3 md:p-4"
            >
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h3 className="text-md md:text-lg font-medium text-gray-300">
                  Participant {index + 1}
                </h3>
                {index > 0 && (
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                <div className="space-y-1 md:space-y-2">
                  <Label
                    htmlFor={`name-${participant.id}`}
                    className="text-gray-400 text-sm md:text-base"
                  >
                    Name
                  </Label>
                  <Input
                    id={`name-${participant.id}`}
                    type="text"
                    value={participant.name}
                    onChange={(e) =>
                      updateParticipant(participant.id, "name", e.target.value)
                    }
                    placeholder="Enter name"
                    className="bg-gray-800 text-white w-[250px] border-gray-700 text-sm md:text-base "
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label
                    htmlFor={`timezone-${participant.id}`}
                    className="text-gray-400 text-sm md:text-base"
                  >
                    Time Zone
                  </Label>
                  <TimeZoneSelect
                    participant={participant}
                    updateParticipant={updateParticipant}
                    CITY_TIME_ZONES={CITY_TIME_ZONES}
                    TIME_ZONES={TIME_ZONES}
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label
                    htmlFor={`from-${participant.id}`}
                    className="text-gray-400 text-sm md:text-base"
                  >
                    Available From
                  </Label>
                  <Input
                    id={`from-${participant.id}`}
                    type="time"
                    value={participant.availableFrom}
                    onChange={(e) =>
                      updateParticipant(
                        participant.id,
                        "availableFrom",
                        e.target.value
                      )
                    }
                    className="bg-gray-800 text-white w-[250px] border-gray-700 text-sm md:text-base"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label
                    htmlFor={`to-${participant.id}`}
                    className="text-gray-400 text-sm md:text-base"
                  >
                    Available To
                  </Label>
                  <Input
                    id={`to-${participant.id}`}
                    type="time"
                    value={participant.availableTo}
                    onChange={(e) =>
                      updateParticipant(
                        participant.id,
                        "availableTo",
                        e.target.value
                      )
                    }
                    className="bg-gray-800 text-white border-gray-700 text-sm md:text-base w-[250px]"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={addParticipant}
            className="w-full text-sm md:text-base cursor-pointer"
          >
            Add Participant
          </Button>
          <Button
            onClick={findCommonTimes}
            variant="secondary"
            className="w-full cursor-pointer text-sm md:text-base"
          >
            Find Common Time Slots
          </Button>
        </div>
      </div>

      {showResults && (
        <Card className="bg-gray-900 text-white border border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Common Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimeSlotGrid participants={participants} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
