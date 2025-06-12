export type UserData = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    conversations: Conversation[];
}

export type Conversation = {
    _id: string;
    messages: Message[];
    startedAt: string;
}

export type Message = {
    content: string;
    role: "user" | "assistant";
}