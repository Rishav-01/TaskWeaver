import { Meeting } from "@/types/meetingsType";

interface GetMeetingsByUserApiResponse {
  message: string;
  success: boolean;
  data: Meeting[];
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
}

export const meetingService = new MeetingService();
