import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const UsersSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
