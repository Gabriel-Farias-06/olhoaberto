export type UserData = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  conversations: Conversation[];
};

export type Conversation = {
  _id: string;
  messages: Message[];
  startedAt: string;
};

export type Message = {
  content: string;
  role: "user" | "assistant";
};

export type Notification = {
  _id: string;
  Title: string;
  content: string;
  date: string;
  alert: string;
  read: boolean;
};

export type Alert = {
  _id: string;
  title: string;
  description: string;
  user: string;
  results: {
    date: string;
    answer: string;
    read?: boolean;
  }[];
};

