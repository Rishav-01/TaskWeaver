interface ActionItems {
  id: string;
  status: "pending" | "completed" | "in-progress";
  assigned_to: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  description: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  date: string;
  status: "completed" | "pending" | "in-progress";
  start_time: string;
  end_time: string;
  duration: number;
  participants: string[];
  action_items: ActionItems[];
}

export interface MeetingReport {
  total_meetings: { value: number; change: number };
  total_hours: { value: number; change: number };
  action_items_completed: { value: number; change: number };
}

export interface CheckedItemObject {
  meeting_id: string;
  description: string;
  assigned_to: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "in-progress";
}
