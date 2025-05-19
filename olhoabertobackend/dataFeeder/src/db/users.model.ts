/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  conversations: [
    {
      messages: [
        {
          content: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            required: true,
            enum: ["user", "assistant"],
          },
        },
      ],
      startedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Users = mongoose.model("Users", UsersSchema);

export default Users;
