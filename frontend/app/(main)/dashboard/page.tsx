"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeetings } from "@/hooks/useMeetings";
import { Meeting } from "@/types/meetingsType";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

const stats = [
  {
    title: "Total Meetings",
    value: "24",
    description: "This month",
    icon: Users,
    trend: { value: "12%", isPositive: true },
  },
  {
    title: "Upcoming Meetings",
    value: "8",
    description: "Next 7 days",
    icon: Calendar,
    trend: { value: "3%", isPositive: true },
  },
  {
    title: "Completed Actions",
    value: "156",
    description: "This month",
    icon: CheckCircle,
    trend: { value: "8%", isPositive: true },
  },
  {
    title: "Pending Actions",
    value: "12",
    description: "Require attention",
    icon: Clock,
    trend: { value: "5%", isPositive: false },
  },
];

const recentMeetings = [
  {
    id: "1",
    title: "Product Strategy Review",
    date: "Today, 2:00 PM",
    participants: [
      { name: "John Doe", avatar: "" },
      { name: "Jane Smith", avatar: "" },
      { name: "Mike Johnson", avatar: "" },
      { name: "Sarah Wilson", avatar: "" },
    ],
    status: "scheduled" as const,
    actionItems: 5,
  },
  {
    id: "2",
    title: "Weekly Team Standup",
    date: "Yesterday, 10:00 AM",
    participants: [
      { name: "Alice Brown", avatar: "" },
      { name: "Bob Wilson", avatar: "" },
      { name: "Carol Davis", avatar: "" },
    ],
    status: "completed" as const,
    actionItems: 3,
  },
  {
    id: "3",
    title: "Client Presentation Prep",
    date: "Dec 10, 3:30 PM",
    participants: [
      { name: "David Lee", avatar: "" },
      { name: "Emma Taylor", avatar: "" },
    ],
    status: "in-progress" as const,
    actionItems: 7,
  },
];

export default function DashboardPage() {
  const { meetings, setIsLoadingMeetings, setIsErrorInMeetings, meetingStats } =
    useMeetings();

  const navigate = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your meetings.
          </p>
        </div>
        <Button onClick={() => navigate.push("/meetings/upload")}>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {meetingStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Meetings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Meetings</CardTitle>
              <Button
                onClick={() => navigate.push("/meetings")}
                variant="outline"
                size="sm"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetings
                .slice(-4, -1)
                .reverse()
                .map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Upload Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">
                    Meeting efficiency up 23% this month
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm">
                    Average meeting duration: 42 minutes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <p className="text-sm">12 action items due this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
