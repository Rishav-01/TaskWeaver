"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeetings } from "@/hooks/useMeetings";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  const {
    meetings,
    setIsLoadingMeetings,
    setIsErrorInMeetings,
    meetingStats,
    averageMeetingTime,
    isLoadingMeetings,
  } = useMeetings();

  const navigate = useRouter();

  if (isLoadingMeetings) {
    return <DashboardLoading />;
  }

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meetingStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Meetings */}
        {meetings.length === 0 ? (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Meetings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  No meetings yet. Upload a new meeting to get started!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
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
                {/* Render first 3 meetings only  */}
                {meetings.slice(0, 3).map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </CardContent>
            </Card>
          </div>
        )}

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
                {/* <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">
                    Meeting efficiency up 23% this month
                  </p>
                </div> */}
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm">
                    Average meeting duration: {averageMeetingTime} minutes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <p className="text-sm">
                    {meetingStats[2].value} action items due this week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
