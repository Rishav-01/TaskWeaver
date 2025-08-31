import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: { name: string; avatar?: string }[];
  status: "completed" | "scheduled" | "in-progress";
  actionItems: number;
}

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "in-progress":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const navigate = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{meeting.title}</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{meeting.date}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate.push(`meetings/${1}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
            <DropdownMenuItem>Download Transcript</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={statusColors[meeting.status]}>
            {meeting.status.replace("-", " ")}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{meeting.actionItems} action items</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <div className="flex -space-x-1">
            {meeting.participants.slice(0, 3).map((participant, index) => (
              <Avatar
                key={index}
                className="h-6 w-6 border-2 border-background"
              >
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">
                  {participant.name
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
        </div>
      </CardContent>
    </Card>
  );
}
