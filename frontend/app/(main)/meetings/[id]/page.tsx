"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  AlertCircle
} from "lucide-react"

const meetingData = {
  id: "1",
  title: "Product Strategy Review",
  date: "Dec 12, 2024",
  time: "2:00 PM - 3:30 PM",
  status: "completed",
  participants: [
    { name: "John Doe", email: "john@example.com", role: "Product Manager", avatar: "" },
    { name: "Jane Smith", email: "jane@example.com", role: "UX Designer", avatar: "" },
    { name: "Mike Johnson", email: "mike@example.com", role: "Engineering Lead", avatar: "" },
    { name: "Sarah Wilson", email: "sarah@example.com", role: "Marketing Director", avatar: "" },
  ],
  transcript: `[00:00] John Doe: Good afternoon everyone, thanks for joining our product strategy review meeting. Let's start by reviewing our Q4 objectives.

[00:30] Jane Smith: I'd like to discuss the user experience improvements we've been working on. The latest user research shows some interesting findings.

[01:15] Mike Johnson: From a technical perspective, we need to prioritize the infrastructure upgrades. I'll need to coordinate with the DevOps team on this.

[02:00] Sarah Wilson: The marketing campaign for the new feature launch is ready. We should align on the timeline.

[02:30] John Doe: Let's schedule a follow-up meeting to finalize the go-to-market strategy. Mike, can you have the technical requirements ready by Friday?

[03:00] Mike Johnson: Yes, I'll have the technical specifications and timeline ready by end of week.

[03:15] Jane Smith: I'll share the updated wireframes with everyone by Thursday.

[03:30] Sarah Wilson: Perfect, I'll coordinate with the content team to align messaging with the new features.`,
  
  actionItems: [
    {
      id: "1",
      description: "Prepare technical specifications and timeline for infrastructure upgrades",
      assignee: "Mike Johnson",
      dueDate: "2024-12-13",
      status: "pending",
      priority: "high",
      extractedByAI: true
    },
    {
      id: "2", 
      description: "Share updated wireframes with team",
      assignee: "Jane Smith",
      dueDate: "2024-12-12",
      status: "completed",
      priority: "medium",
      extractedByAI: true
    },
    {
      id: "3",
      description: "Coordinate with content team on messaging alignment",
      assignee: "Sarah Wilson", 
      dueDate: "2024-12-15",
      status: "in-progress",
      priority: "medium",
      extractedByAI: true
    },
    {
      id: "4",
      description: "Schedule follow-up meeting for go-to-market strategy",
      assignee: "John Doe",
      dueDate: "2024-12-14", 
      status: "pending",
      priority: "high",
      extractedByAI: false
    }
  ]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300", 
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

export default function MeetingDetailPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{meetingData.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{meetingData.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{meetingData.time}</span>
            </div>
            <Badge className={statusColors[meetingData.status as keyof typeof statusColors]}>
              {meetingData.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Transcript
          </Button>
          <DropdownMenu>
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
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transcript" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Meeting Transcript</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transcript..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This transcript has been processed by AI for enhanced readability and action item extraction.
                  </p>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                    {meetingData.transcript}
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
                {meetingData.actionItems.filter(item => item.extractedByAI).length} items extracted by AI
              </p>
            </div>
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
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
                    <Textarea id="description" placeholder="Enter task description..." />
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
                            <SelectItem key={participant.email} value={participant.email}>
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
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddTaskOpen(false)}>
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {meetingData.actionItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {item.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : item.status === "in-progress" ? (
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="font-medium">{item.description}</p>
                        <div className="flex items-center space-x-2">
                          {item.extractedByAI && (
                            <Badge variant="outline" className="text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                          <Badge className={priorityColors[item.priority as keyof typeof priorityColors]}>
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {item.assignee.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due {item.dueDate}</span>
                        </div>
                        <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Meeting Participants ({meetingData.participants.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {meetingData.participants.map((participant) => (
                  <div key={participant.email} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{participant.name}</h4>
                      <p className="text-sm text-muted-foreground">{participant.role}</p>
                      <p className="text-xs text-muted-foreground">{participant.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}