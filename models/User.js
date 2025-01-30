// server/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  dob: {
    type: Date,
  },
  almaMater: {
    type: String,
  },
  lastYearOfEducation:{
    type:Date
  },
  accountType: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default:"https://th.bing.com/th/id/OIP.GqGVPkLpUlSo5SmeDogUdwHaHa?w=194&h=194&c=7&r=0&o=5&dpr=2&pid=1.7"
  },
  
  

},
{
  timestamps: true,
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;