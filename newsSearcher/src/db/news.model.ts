/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  embedding: { type: [Number], required: true },
});

const News = mongoose.model("News", NewsSchema);

export default News;
