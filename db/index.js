const mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017');

// Define schemas
const AdminSchema = new mongoose.Schema({
  username: { type: String, min: 3, max: 20 },
  password: { type: String, min: 8, max: 30 },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, min: 3, max: 20 },
  password: { type: String, min: 8, max: 30 },
  purchasedCoursesId: [
    {
      type: String,
      // ref: 'course',
    },
  ],
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
