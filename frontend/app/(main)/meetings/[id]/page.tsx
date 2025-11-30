"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Search,
  Plus,
  Calendar,
  Clock,
  Users,
  MoreHorizontal,
  Bot,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";
import { useMeetings } from "@/hooks/useMeetings";
import { useParams } from "next/navigation";
import { CheckedItemObject } from "@/types/meetingsType";

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in-progress":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  medium:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function MeetingDetailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<CheckedItemObject[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { id: meetingId } = useParams();
  const {
    getMeetingById,
    isLoadingMeeting,
    isErrorinMeeting,
    meeting,
    updateMeetingActionItems,
  } = useMeetings();

  useEffect(() => {
    if (meeting) {
      const completedItems = meeting.action_items.map((item) => ({
        meeting_id: meetingId as string,
        description: item.description,
        assigned_to: item.assigned_to,
        due_date: item.due_date,
        priority: item.priority,
        status: item.status,
      }));
      setCheckedItems(completedItems);
    }
  }, [meeting, meetingId]);

  const handleCheckedChange = (item: any, checked: boolean) => {
    setCheckedItems((prevItems) => {
      return prevItems.map((prevItem) => {
        if (prevItem.description === item.description) {
          // If the item is found, update its status based on the checkbox
          return { ...prevItem, status: checked ? "completed" : "pending" };
        }
        // Otherwise, return the item unchanged
        return prevItem;
      });
    });
  };

  const handleUpdateStatus = () => {
    // Logic to update status of selected action items
    updateMeetingActionItems(checkedItems);
    setCheckedItems([]);
    getMeetingById(meetingId as string);
  };

  useEffect(() => {
    if (meetingId) {
      getMeetingById(meetingId as string);
    }
  }, [meetingId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{meeting?.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{meeting?.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {meeting?.start_time} - {meeting?.end_time}
              </span>
            </div>
            <Badge
              className={
                statusColors[meeting?.status as keyof typeof statusColors]
              }
            >
              {meeting?.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Transcript
          </Button> */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
              <DropdownMenuItem>Export Summary</DropdownMenuItem>
              <DropdownMenuItem>Share Meeting</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transcript" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcript">Summary</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Meeting Summary</CardTitle>
                {/* <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transcript..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div> */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This summary has been processed by AI for enhanced
                    readability.
                  </p>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {meeting?.summary}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Action Items</h3>
              <p className="text-sm text-muted-foreground">
                {meeting?.action_items.length} items extracted by AI
              </p>
            </div>
            {/* <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Action Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingData.participants.map((participant) => (
                            <SelectItem
                              key={participant.email}
                              value={participant.email}
                            >
                              {participant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddTaskOpen(false)}>
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog> */}
            <Button
              disabled={
                checkedItems.length === 0 ||
                checkedItems.every((item) => item.status === "completed")
              }
              onClick={handleUpdateStatus}
            >
              Update Status
            </Button>
          </div>

          <div className="space-y-3">
            {meeting?.action_items.map((item) => (
              <Card key={item.description} className="p-4">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={item.description}
                    checked={checkedItems.some(
                      (checkedItem) =>
                        checkedItem.description === item.description &&
                        checkedItem.status === "completed"
                    )}
                    disabled={item.status === "completed"}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(item, !!checked)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor={item.description}
                      className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.description}
                    </label>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {item.assigned_to
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.assigned_to}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due {item.due_date}</span>
                        </div>
                        <Badge
                          className={
                            priorityColors[
                              item.priority as keyof typeof priorityColors
                            ]
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          className={
                            statusColors[
                              item.status as keyof typeof statusColors
                            ]
                          }
                        >
                          {item?.status?.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>
                  Meeting Participants ({meeting?.participants.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {meeting?.participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center space-x-3 p-4 border rounded-lg"
                  >
                    <Avatar className="h-12 w-12">
                      {/* <AvatarImage src={participant.avatar} /> */}
                      <AvatarFallback>
                        {participant
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{participant}</h4>
                      {/* <p className="text-sm text-muted-foreground">
                        {participant.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.email}
                      </p> */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
