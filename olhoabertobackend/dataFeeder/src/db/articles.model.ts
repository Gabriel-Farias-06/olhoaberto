/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const ArticlesSchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
  embedding: { type: [Number], required: true },
});

const Articles = mongoose.model("Articles", ArticlesSchema);

export default Articles;
