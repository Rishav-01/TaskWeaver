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
