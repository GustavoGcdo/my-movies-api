import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
  name: String,
  isMain: Boolean,
  favoriteGenres: [Number]
});

const schema = new Schema(
  {
    email: String,
    password: String,    
    birthday: Date,
    profiles: [profileSchema],
    socialLogin: {
      facebookId: Number
    }
  },
  {
    timestamps: true,
  },
);

export default model('User', schema);
