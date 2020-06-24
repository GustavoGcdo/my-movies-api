import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    info: {
      id: Number,
      original_title: String,
      title: String,
      backdrop_path: String,
      poster_path: String,
      overview: String,
      genres: [
        {
          id: Number,
          name: String,
        },
      ],
      release_date: Date,
    },
    watched: Boolean,
    profile: {
      _id: String,
      name: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model('MyMovie', schema);
