import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Post', PostSchema);