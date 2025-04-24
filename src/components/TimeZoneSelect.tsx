import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Participant {
  id: string;
  name: string;
  timeZone: string;
  availableFrom: string;
  availableTo: string;
}

interface TimeZoneSelectProps {
  participant: Participant;
  updateParticipant: (
    id: string,
    field: keyof Participant,
    value: string
  ) => void;
  CITY_TIME_ZONES: { name: string; zone: string }[];
  TIME_ZONES: string[];
}

export function TimeZoneSelect({
  participant,
  updateParticipant,
  TIME_ZONES,
}: TimeZoneSelectProps) {
  const handleChange = (value: string) => {
    updateParticipant(participant.id, "timeZone", value);
  };

  return (
    <Select value={participant.timeZone} onValueChange={handleChange}>
    <SelectTrigger className="w-[250px] bg-gray-900 text-white border border-gray-700 hover:bg-gray-800">
      <SelectValue placeholder="Select a time zone" />
    </SelectTrigger>
    <SelectContent className="bg-gray-900 text-white">
      <SelectGroup>
        <SelectLabel className="text-gray-400">All Time Zones</SelectLabel>
        {TIME_ZONES.map((zone) => (
          <SelectItem
            key={zone}
            value={zone}
            className="hover:bg-gray-800 hover:text-white"
          >
            {zone}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  );
}
