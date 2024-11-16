import { format, addMinutes } from "date-fns";
import _ from "lodash";
import { Events } from "@/types/time-table-events";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getBackgroundColor } from "@/utils/dayHelper";

const TimeTableEvents = ({ events }: { events: Events }) => {
    const timeSlots = _.range(7 * 60, 23 * 60 + 1, 20).map((minutes) => ({
        label: format(addMinutes(new Date(2022, 0, 1, 0, 0), minutes), "HH:mm"),
        minutes,
    }));

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    const ensureDate = (value: any): Date => {
        if (value instanceof Date) {
            return value;
        }
        return new Date(value);
    };

    return (
        <ScrollArea className="w-full h-full bg-background text-foreground sm:rounded-lg shadow-md">
            {/* Header with Days */}
            <div className="flex">
                <div className="w-16 text-center self-center sticky top-0 bg-background z-10">
                    Time
                </div>
                {days.map((day) => (
                    <div
                        key={day}
                        className="flex-1 text-center py-2 border-b font-medium capitalize sticky top-0 bg-background z-10"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Time Slots with Events */}
            <div className="flex">
                {/* Time Column */}
                <div className="flex flex-col w-16 border-r sticky left-0 bg-background z-10">
                    {timeSlots.map((slot) => (
                        <div
                            key={slot.minutes}
                            className="h-12 text-xs font-medium flex items-center justify-center border-b"
                        >
                            {slot.label}
                        </div>
                    ))}
                </div>

                {/* Day Columns */}
                {days.map((day) => (
                    <div key={day} className="flex-1 border-r relative">
                        {/* Time Slots */}
                        {timeSlots.map((slot) => (
                            <div
                                key={slot.minutes}
                                className="h-12 border-b"
                            ></div>
                        ))}

                        {/* Events */}
                        {events[day]?.map((event) => {
                            const startMinutes =
                                ensureDate(event.startTime).getHours() * 60 +
                                ensureDate(event.startTime).getMinutes();
                            const endMinutes =
                                ensureDate(event.endTime).getHours() * 60 +
                                ensureDate(event.endTime).getMinutes();

                            const startSlot = (startMinutes - 7 * 60) / 20; // Map to 20-min slots
                            const duration = (endMinutes - startMinutes) / 20; // Convert to slots

                            return (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "absolute rounded shadow-md text-xs px-2 py-1",
                                        "w-[95%]",
                                        getBackgroundColor(day)
                                    )}
                                    style={{
                                        top: `${startSlot * 3}rem`, // Height per slot = 3rem
                                        height: `${duration * 3}rem`, // Duration in slots * height
                                        left: "2.5%", // Centered horizontally
                                    }}
                                >
                                    {event.name}
                                    {event.type && (
                                        <div className="text-xs">
                                            {event.type}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <ScrollBar orientation="vertical" />
        </ScrollArea>
    );
};

export default TimeTableEvents;
