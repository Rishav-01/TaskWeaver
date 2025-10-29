"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Users,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMeetings } from "@/hooks/useMeetings";

const meetings = [
  {
    id: "1",
    title: "Product Strategy Review",
    date: "Dec 12, 2024",
    time: "2:00 PM",
    participants: [
      { name: "John Doe", avatar: "" },
      { name: "Jane Smith", avatar: "" },
      { name: "Mike Johnson", avatar: "" },
    ],
    status: "scheduled",
    actionItems: 5,
    duration: "60 min",
  },
  {
    id: "2",
    title: "Weekly Team Standup",
    date: "Dec 11, 2024",
    time: "10:00 AM",
    participants: [
      { name: "Alice Brown", avatar: "" },
      { name: "Bob Wilson", avatar: "" },
      { name: "Carol Davis", avatar: "" },
    ],
    status: "completed",
    actionItems: 3,
    duration: "30 min",
  },
  {
    id: "3",
    title: "Client Presentation Prep",
    date: "Dec 10, 2024",
    time: "3:30 PM",
    participants: [
      { name: "David Lee", avatar: "" },
      { name: "Emma Taylor", avatar: "" },
    ],
    status: "completed",
    actionItems: 7,
    duration: "90 min",
  },
  {
    id: "4",
    title: "Budget Planning Q1 2025",
    date: "Dec 9, 2024",
    time: "11:00 AM",
    participants: [
      { name: "Frank Miller", avatar: "" },
      { name: "Grace Lee", avatar: "" },
      { name: "Henry Chen", avatar: "" },
      { name: "Iris Wang", avatar: "" },
    ],
    status: "completed",
    actionItems: 12,
    duration: "120 min",
  },
];

const statusColors = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

export default function MeetingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { getMeetings, meetings } = useMeetings();

  const navigate = useRouter();

  useEffect(() => {
    getMeetings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-muted-foreground">
            Manage and review all your meetings
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/upload">
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action Items</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => navigate.push(`/meetings/${meeting.id}`)}
                  key={meeting.id}
                >
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {meeting.start_time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {meeting.participants
                          .slice(0, 3)
                          .map((participant, index) => (
                            <Avatar
                              key={index}
                              className="h-6 w-6 border-2 border-background"
                            >
                              {/* <AvatarImage src={participant.avatar} /> */}
                              <AvatarFallback className="text-xs">
                                {participant
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        {meeting.participants.length > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                            +{meeting.participants.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {meeting.participants.length} participants
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusColors[
                          meeting.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {meeting.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.action_items.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>{meeting.duration}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/meetings/${meeting.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
                        <DropdownMenuItem>Download Transcript</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
