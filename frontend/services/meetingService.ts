import {
  CheckedItemObject,
  Meeting,
  MeetingReport,
} from "@/types/meetingsType";

interface GetMeetingsByUserApiResponse {
  message: string;
  success: boolean;
  data: Meeting[];
}

interface GetMeetingByIdApiResponse {
  message: string;
  success: boolean;
  data: Meeting;
}

interface UploadMeetingApiResponse {
  message: string;
  success: boolean;
  data: Meeting;
}

class MeetingService {
  private VITE_API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

  getMeetings = async (): Promise<GetMeetingsByUserApiResponse> => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    try {
      const response = await fetch(`${this.VITE_API_URL}/meetings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  getMeetingById = async (
    meetingId: string
  ): Promise<GetMeetingByIdApiResponse> => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    try {
      const response = await fetch(
        `${this.VITE_API_URL}/meetings/${meetingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  uploadMeeting = async (file: File): Promise<UploadMeetingApiResponse> => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${this.VITE_API_URL}/upload-meeting`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to upload and process meeting"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading meeting:", error);
      throw error;
    }
  };

  getMeetingReport = async (timeRange: string): Promise<MeetingReport> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const queryParams = timeRange ? `?timeRange=${timeRange}` : "";

    try {
      const response = await fetch(
        `${this.VITE_API_URL}/report${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meeting report");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  updateMeetingActionItems = async (
    updatedActionItems: CheckedItemObject
  ): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    try {
      const response = await fetch(
        `${this.VITE_API_URL}/meetings/${updatedActionItems.meeting_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meetingId: updatedActionItems.meeting_id,
            actionItems: updatedActionItems.updated_action_items,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update meeting action items");
      }
    } catch (error) {
      throw error;
    }
  };
}

export const meetingService = new MeetingService();
