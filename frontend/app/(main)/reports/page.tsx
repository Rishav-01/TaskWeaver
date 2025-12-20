"use client";

import ReportsLoading from "./loading";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  Download,
  Calendar,
} from "lucide-react";
import { useMeetingContext } from "@/context/MeetingContext";

const reportDataByTimeRange = {
  week: {
    totalMeetings: { value: 5, change: -10, period: "this week" },
    totalHours: { value: 8.5, change: -15, period: "this week" },
    actionItemsCompleted: { value: 32, change: 5, period: "this week" },
    participantEngagement: { value: 91, change: 2, period: "this week" },
  },
  month: {
    totalMeetings: { value: 24, change: 12, period: "this month" },
    totalHours: { value: 42.5, change: -8, period: "this month" },
    actionItemsCompleted: { value: 156, change: 23, period: "this month" },
    participantEngagement: { value: 87, change: 5, period: "this month" },
  },
  quarter: {
    totalMeetings: { value: 70, change: 15, period: "this quarter" },
    totalHours: { value: 120, change: -5, period: "this quarter" },
    actionItemsCompleted: { value: 450, change: 18, period: "this quarter" },
    participantEngagement: { value: 89, change: 4, period: "this quarter" },
  },
  year: {
    totalMeetings: { value: 280, change: 25, period: "this year" },
    totalHours: { value: 480, change: 10, period: "this year" },
    actionItemsCompleted: { value: 1800, change: 30, period: "this year" },
    participantEngagement: { value: 90, change: 7, period: "this year" },
  },
};

const meetingTrendsByTimeRange = {
  week: {
    label: "Day",
    data: [
      { period: "Mon", meetings: 1, hours: 2 },
      { period: "Tue", meetings: 2, hours: 3 },
      { period: "Wed", meetings: 1, hours: 1.5 },
      { period: "Thu", meetings: 0, hours: 0 },
      { period: "Fri", meetings: 1, hours: 2 },
    ],
  },
  month: {
    label: "Week",
    data: [
      { period: "Week 1", meetings: 5, hours: 8.5 },
      { period: "Week 2", meetings: 6, hours: 10 },
      { period: "Week 3", meetings: 7, hours: 12 },
      { period: "Week 4", meetings: 6, hours: 12 },
    ],
  },
  quarter: {
    label: "Month",
    data: [
      { period: "Oct", meetings: 20, hours: 35 },
      { period: "Nov", meetings: 26, hours: 45 },
      { period: "Dec", meetings: 24, hours: 42 },
    ],
  },
  year: {
    label: "Month",
    data: [
      { period: "Jan", meetings: 20, hours: 35 },
      { period: "Feb", meetings: 18, hours: 32 },
      { period: "Mar", meetings: 25, hours: 40 },
      { period: "Apr", meetings: 22, hours: 38 },
      { period: "May", meetings: 26, hours: 45 },
      { period: "Jun", meetings: 24, hours: 42 },
      { period: "Jul", meetings: 28, hours: 50 },
      { period: "Aug", meetings: 18, hours: 32 },
      { period: "Sep", meetings: 22, hours: 38 },
      { period: "Oct", meetings: 20, hours: 35 },
      { period: "Nov", meetings: 26, hours: 45 },
      { period: "Dec", meetings: 24, hours: 42 },
    ],
  },
};

const topParticipants = [
  { name: "John Doe", meetings: 15, hours: 18.5, actionItems: 23 },
  { name: "Jane Smith", meetings: 12, hours: 14.2, actionItems: 19 },
  { name: "Mike Johnson", meetings: 11, hours: 16.8, actionItems: 21 },
  { name: "Sarah Wilson", meetings: 9, hours: 12.3, actionItems: 15 },
  { name: "David Lee", meetings: 8, hours: 10.5, actionItems: 12 },
];

const actionItemsStatus = [
  { status: "Completed", count: 156, percentage: 68 },
  { status: "In Progress", count: 42, percentage: 18 },
  { status: "Overdue", count: 18, percentage: 8 },
  { status: "Pending", count: 14, percentage: 6 },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const { meetingReport, getMeetingReport, isLoadingMeetingReport } =
    useMeetingContext();

  useEffect(() => {
    getMeetingReport(timeRange);
  }, [timeRange]);

  const reportData =
    reportDataByTimeRange[timeRange as keyof typeof reportDataByTimeRange];
  const meetingTrends =
    meetingTrendsByTimeRange[
      timeRange as keyof typeof meetingTrendsByTimeRange
    ];
  const maxMeetings = Math.max(...meetingTrends.data.map((t) => t.meetings), 1);

  const calculatePercentage = (part: number, total: number) => {
    return total === 0 ? 0 : Math.round((part / total) * 100);
  };

  const [totalActionItems, setTotalActionItems] = useState<number>(0);
  const [actionItemsPendingPercentage, setActionItemsPendingPercentage] =
    useState<number>(0);
  const [actionItemsInProgressPercentage, setActionItemsInProgressPercentage] =
    useState<number>(0);
  const [actionItemsCompletedPercentage, setActionItemsCompletedPercentage] =
    useState<number>(0);

  const [animatedCompletedCount, setAnimatedCompletedCount] =
    useState<number>(0);
  const [animatedInProgressCount, setAnimatedInProgressCount] =
    useState<number>(0);
  const [animatedPendingCount, setAnimatedPendingCount] = useState<number>(0);

  useEffect(() => {
    if (meetingReport) {
      const totalActionItems = meetingReport.total_action_items?.value || 0;
      setTotalActionItems(totalActionItems);

      const completedValue = meetingReport.action_items_completed?.value || 0;
      const inProgressValue =
        meetingReport.action_items_in_progress?.value || 0;
      const pendingValue = meetingReport.action_items_pending?.value || 0;

      const completedPercentage = calculatePercentage(
        completedValue,
        totalActionItems
      );
      const inProgressPercentage = calculatePercentage(
        inProgressValue,
        totalActionItems
      );
      const pendingPercentage = calculatePercentage(
        pendingValue,
        totalActionItems
      );

      let startTimestamp: number | null = null;
      const duration = 1000;

      const animate = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setAnimatedCompletedCount(Math.floor(easeProgress * completedValue));
        setAnimatedInProgressCount(Math.floor(easeProgress * inProgressValue));
        setAnimatedPendingCount(Math.floor(easeProgress * pendingValue));

        setActionItemsCompletedPercentage(
          Math.floor(easeProgress * completedPercentage)
        );
        setActionItemsInProgressPercentage(
          Math.floor(easeProgress * inProgressPercentage)
        );
        setActionItemsPendingPercentage(
          Math.floor(easeProgress * pendingPercentage)
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedCompletedCount(completedValue);
          setAnimatedInProgressCount(inProgressValue);
          setAnimatedPendingCount(pendingValue);
          setActionItemsCompletedPercentage(completedPercentage);
          setActionItemsInProgressPercentage(inProgressPercentage);
          setActionItemsPendingPercentage(pendingPercentage);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [meetingReport]);

  if (!meetingReport) {
    return null;
  }

  if (isLoadingMeetingReport) {
    return <ReportsLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your meeting performance and productivity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button> */}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Meetings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {meetingReport?.total_meetings.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.totalMeetings.period}
            </p>
            <div
              className={`flex items-center text-xs mt-1 ${
                meetingReport && meetingReport.total_meetings.change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {meetingReport && meetingReport.total_meetings.change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {meetingReport && meetingReport.total_meetings.change >= 0
                  ? "+"
                  : ""}
                {meetingReport?.total_meetings.change}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {meetingReport?.total_hours.value}h
            </div>
            <p className="text-xs text-muted-foreground">this {timeRange}</p>
            <div
              className={`flex items-center text-xs mt-1 ${
                meetingReport && meetingReport.total_hours.change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {meetingReport && meetingReport?.total_hours.change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {meetingReport && meetingReport?.total_hours.change >= 0
                  ? "+"
                  : ""}
                {meetingReport?.total_hours.change}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actions Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {meetingReport?.action_items_completed.value}
            </div>
            <p className="text-xs text-muted-foreground">this {timeRange}</p>
            <div
              className={`flex items-center text-xs mt-1 ${
                meetingReport &&
                meetingReport?.action_items_completed.change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {meetingReport &&
              meetingReport?.action_items_completed.change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {meetingReport &&
                meetingReport?.action_items_completed.change >= 0
                  ? "+"
                  : ""}
                {meetingReport?.action_items_completed.change}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.participantEngagement.value}%
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.participantEngagement.period}
            </p>
            <div
              className={`flex items-center text-xs mt-1 ${
                reportData.participantEngagement.change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {reportData.participantEngagement.change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {reportData.participantEngagement.change >= 0 ? "+" : ""}
                {reportData.participantEngagement.change}%
              </span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex justify-center items-center">
        {/* Meeting Trends Chart */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Meeting Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span className="w-16">{meetingTrends.label}</span>
                <span>Meetings</span>
                <span>Hours</span>
              </div>
              {meetingTrends.data.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-16">
                    {trend.period}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(trend.meetings / maxMeetings) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm w-8">{trend.meetings}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {trend.hours}h
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Action Items Status */}
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Action Items Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* {actionItemsStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        item.status === "Completed"
                          ? "bg-green-500"
                          : item.status === "In Progress"
                          ? "bg-blue-500"
                          : item.status === "Overdue"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === "Completed"
                            ? "bg-green-500"
                            : item.status === "In Progress"
                            ? "bg-blue-500"
                            : item.status === "Overdue"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">
                      {item.count}
                    </span>
                    <span className="text-sm text-muted-foreground w-8">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))} */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 " />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${actionItemsCompletedPercentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">
                    {animatedCompletedCount}
                  </span>
                  <span className="text-sm text-muted-foreground w-8">
                    {actionItemsCompletedPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500 " />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${actionItemsInProgressPercentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">
                    {animatedInProgressCount}
                  </span>
                  <span className="text-sm text-muted-foreground w-8">
                    {actionItemsInProgressPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500 " />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${actionItemsPendingPercentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">
                    {animatedPendingCount}
                  </span>
                  <span className="text-sm text-muted-foreground w-8">
                    {actionItemsPendingPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Participants */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Top Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <span>Participant</span>
              <span>Meetings</span>
              <span>Hours</span>
              <span>Action Items</span>
            </div>
            {topParticipants.map((participant, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-medium">{participant.name}</span>
                </div>
                <span>{participant.meetings}</span>
                <span>{participant.hours}h</span>
                <div className="flex items-center space-x-2">
                  <span>{participant.actionItems}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((participant.actionItems / 25) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
