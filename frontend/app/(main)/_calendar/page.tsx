"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
} from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday as isTodayDateFns,
  addDays,
  subDays,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useMeetings } from "@/hooks/useMeetings";

const statusColors = {
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "in-progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function CalendarPage() {
  const { meetings, isLoadingMeetings, isErrorinMeetings } = useMeetings();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState("month");
  const navigate = useRouter();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getMeetingsForDate = (date: Date) => {
    const dateStr = format(date, "dd-MM-yyyy");
    return meetings.filter((meeting) => meeting.date === dateStr);
  };

  const getDayMeetings = (day: number) => {
    const dateStr = `${day.toString().padStart(2, "0")}-${(month + 1)
      .toString()
      .padStart(2, "0")}-${year}`;
    return meetings.filter((meeting) => meeting.date === dateStr);
  };

  const renderCalendarGrid = () => {
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Day headers
    dayNames.forEach((day) =>
      days.push(
        <div
          key={day}
          className="p-2 text-center font-medium text-muted-foreground border-b"
        >
          {day}
        </div>
      )
    );

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 border-b border-r"></div>
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMeetings = getDayMeetings(day);
      const today = new Date();
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 border-b border-r min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors ${
            isToday ? "bg-primary/10" : ""
          }`}
          onClick={() => {
            const newSelectedDate = new Date(year, month, day);
            setSelectedDate(newSelectedDate);
          }}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-primary" : ""
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayMeetings.slice(0, 2).map((meeting) => (
              <div
                key={meeting.id}
                className="text-xs p-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 truncate"
              >
                {meeting?.start_time} {meeting.title}
              </div>
            ))}
            {dayMeetings.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayMeetings.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return (
      <div className="grid grid-cols-7 border-t">
        {/* Week headers */}
        {daysInWeek.map((day) => (
          <div
            key={format(day, "T") + "-header"}
            className="p-2 text-center font-medium text-muted-foreground border-b border-r"
          >
            <div>{format(day, "EEE")}</div>
            <div
              className={`text-2xl font-bold mt-1 ${
                isTodayDateFns(day) ? "text-primary" : ""
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Week content */}
        {daysInWeek.map((day) => {
          const dayMeetings = getMeetingsForDate(day);
          return (
            <div
              key={format(day, "T") + "-content"}
              className="p-2 border-b border-r min-h-[400px] overflow-y-auto space-y-2"
              onClick={() => setSelectedDate(day)}
            >
              {dayMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="text-xs p-2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer"
                >
                  <div className="font-semibold truncate">{meeting.title}</div>
                  <div>{meeting?.start_time}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayMeetings = getMeetingsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const durationToMinutes = (durationStr: string) => {
      return parseInt(durationStr, 10);
    };

    return (
      <div className="flex border-t" style={{ minHeight: "calc(24 * 6rem)" }}>
        {/* Time column */}
        <div className="w-20 shrink-0 text-center text-xs text-muted-foreground">
          {hours.map((hour) => (
            <div key={hour} className="relative h-24 border-r">
              {hour > 0 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  {format(new Date(2000, 0, 1, hour), "ha")}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="relative flex-1">
          {/* Hour lines */}
          {hours.map((hour) => (
            <div key={hour} className="h-24 border-b"></div>
          ))}

          {/* Meetings */}
          {dayMeetings.map((meeting) => {
            const top = (timeToMinutes(meeting?.start_time) / 60) * 96; // 96px/hr (h-24)
            const height =
              (durationToMinutes(String(meeting?.duration)) / 60) * 96;

            return (
              <div
                key={meeting.id}
                className="absolute left-2 right-2 z-10 cursor-pointer rounded-lg border border-blue-200 bg-blue-100 p-2 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300"
                style={{ top: `${top}px`, height: `${height}px` }}
                onClick={() => setSelectedDate(currentDate)}
              >
                <div className="truncate text-sm font-semibold">
                  {meeting.title}
                </div>
                <div className="text-xs">{meeting?.start_time}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    switch (viewMode) {
      case "month":
        return (
          <div className="grid grid-cols-7 border-t">
            {renderCalendarGrid()}
          </div>
        );
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
    }
  };

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else if (viewMode === "day") {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === "month") {
      return `${monthName} ${year}`;
    }
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      const startMonth = format(weekStart, "MMM");
      const endMonth = format(weekEnd, "MMM");
      return startMonth === endMonth
        ? `${format(weekStart, "MMM d")} - ${format(weekEnd, "d, yyyy")}`
        : `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM d, yyyy");
  };
  const today = new Date();
  const todayDateString = `${today.getDate().toString().padStart(2, "0")}-${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;
  const todaysMeetings = meetings.filter((m) => m.date === todayDateString);
  const selectedDateMeetings = selectedDate
    ? getMeetingsForDate(selectedDate)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your meeting schedule</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate.push("/meetings/upload")}>
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{getHeaderTitle()}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">{renderCalendar()}</CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysMeetings.length > 0 ? (
                todaysMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{meeting.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{meeting?.start_time}</span>
                        <span>•</span>
                        <span>{meeting.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3" />
                        <span>{meeting.participants} participants</span>
                      </div>
                    </div>
                    <Badge
                      className={
                        statusColors[
                          meeting.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No meetings today
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Total meetings</span>
                  <span className="font-medium">{meetings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total hours</span>
                  <span className="font-medium">5.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants</span>
                  <span className="font-medium">18 people</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meeting details dialog */}
      <Dialog
        open={!!selectedDate}
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Meetings for {selectedDate && selectedDate.toLocaleDateString()}
            </DialogTitle>
            <DialogDescription>
              {selectedDateMeetings.length} meeting(s) scheduled for this day
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDateMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{meeting.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{meeting?.start_time}</span>
                    <span>•</span>
                    <span>{meeting.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Users className="h-3 w-3" />
                    <span>{meeting.participants.length} participants</span>
                  </div>
                </div>
                <Badge
                  className={
                    statusColors[meeting.status as keyof typeof statusColors]
                  }
                >
                  {meeting.status}
                </Badge>
              </div>
            ))}
            {selectedDateMeetings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No meetings scheduled for this day
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
