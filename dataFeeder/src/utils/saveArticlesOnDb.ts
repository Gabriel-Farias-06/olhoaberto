/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  pdfPage: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  content: {
    type: Date,
    required: true,
  },
  embedding: { type: [Number], required: true },
});

const News = mongoose.model("News", NewsSchema);

export default News;
