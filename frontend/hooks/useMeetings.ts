import { meetingService } from "@/services/meetingService";
import { Meeting } from "@/types/meetingsType";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";

export const useMeetings = () => {
  // For all meetings
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [isErrorinMeetings, setIsErrorInMeetings] = useState<string | null>(
    null
  );
  const [meetingStats, setMeetingStats] = useState([
    {
      title: "Total Meetings",
      value: 0,
      icon: Users,
      description: "This month",
      trend: { value: "12%", isPositive: true },
    },
    {
      title: "Upcoming Meetings",
      value: 0,
      icon: Calendar,
      description: "Next 7 days",
      trend: { value: "3%", isPositive: true },
    },
    {
      title: "Completed Actions",
      value: 0,
      icon: CheckCircle,
      description: "This month",
      trend: { value: "8%", isPositive: true },
    },
    {
      title: "Pending Actions",
      value: 0,
      icon: Clock,
      description: "Requires attention",
      trend: { value: "5%", isPositive: false },
    },
  ]);

  // For individual meeting
  const [meeting, setMeeting] = useState<Meeting>();
  const [isLoadingMeeting, setIsLoadingMeeting] = useState(false);
  const [isErrorinMeeting, setIsErrorInMeeting] = useState<string | null>(null);

  // For uploading a meeting
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedMeeting, setUploadedMeeting] = useState<Meeting | null>(null);

  const getMeetings = async () => {
    setIsLoadingMeetings(true);
    try {
      const meetingsByUser = await meetingService.getMeetings();
      setMeetings(meetingsByUser.data);
      setMeetingStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.title === "Total Meetings") {
            return { ...stat, value: meetingsByUser.data.length };
          }
          if (stat.title === "Upcoming Meetings") {
            return {
              ...stat,
              value: meetingsByUser.data.filter(
                (meeting) => meeting.status === "pending"
              ).length,
            };
          }
          if (stat.title === "Completed Actions") {
            const completedActionsCount = meetingsByUser.data.reduce(
              (count, meeting) => {
                return (
                  count +
                  meeting.action_items.filter(
                    (item) => item.status === "completed"
                  ).length
                );
              },
              0
            );
            return { ...stat, value: completedActionsCount };
          }
          if (stat.title === "Pending Actions") {
            const pendingActionsCount = meetingsByUser.data.reduce(
              (count, meeting) => {
                return (
                  count +
                  meeting.action_items.filter(
                    (item) => item.status === "pending"
                  ).length
                );
              },
              0
            );
            return { ...stat, value: pendingActionsCount };
          }
          return stat;
        })
      );
    } catch (error) {
      setIsErrorInMeetings("Failed to fetch meetings");
      throw error;
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const getMeetingById = async (meetingId: string) => {
    setIsLoadingMeeting(true);
    try {
      const meetingById = await meetingService.getMeetingById(meetingId);
      setMeeting(meetingById.data);
    } catch (error) {
      setIsErrorInMeeting("Failed to fetch meeting");
      throw error;
    } finally {
      setIsLoadingMeeting(false);
    }
  };

  const uploadMeeting = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await meetingService.uploadMeeting(file);
      setUploadedMeeting(result.data);
      // Optionally, refresh the list of meetings after a successful upload
      await getMeetings();
      return result.data;
    } catch (error: any) {
      setUploadError(
        error.message || "An unknown error occurred during upload."
      );
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    getMeetings();
  }, []);

  return {
    getMeetings,
    meetings,
    setIsLoadingMeetings,
    setIsErrorInMeetings,
    meetingStats,
    isLoadingMeetings,
    isErrorinMeetings,
    getMeetingById,
    meeting,
    isLoadingMeeting,
    isErrorinMeeting,
    uploadMeeting,
    isUploading,
    uploadError,
    uploadedMeeting,
  };
};
