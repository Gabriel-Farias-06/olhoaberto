import { ChannelModel } from "amqplib";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BROKER: {
  value: null | ChannelModel;
  hasNewArticle: null | boolean;
} = {
  value: null,
  hasNewArticle: null,
};
