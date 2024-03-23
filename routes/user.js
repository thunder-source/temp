const { Router } = require('express');
const router = Router();
const userMiddleware = require('../middleware/user');
const zod = require('zod');
const { User, Course } = require('../db/index.js');
var jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

// User Routes
router.post('/signup', async (req, res) => {
  const username = zod.string().email().safeParse(req.body.username);
  const password = zod.string().min(8).max(30).safeParse(req.body.password);

  if (username.success && password.success) {
    try {
      const user = await User.create({
        username: req.body.username,
        password: req.body.password,
      });
      if (user) {
        res.json({
          message: 'user created successfully',
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      message: 'Please enter a valid username and password',
    });
  }
});

router.post('/signin', async (req, res) => {
  const username = zod.string().email().safeParse(req.body.username);
  const password = zod.string().min(8).max(30).safeParse(req.body.password);

  if (username.success && password.success) {
    try {
      const user = await User.find({
        username: req.body.username,
        password: req.body.password,
      });
      console.log(user);
      if (user) {
        let token = jwt.sign({ username: req.body.username }, secretKey);
        res.json({
          token: token,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  } else {
    res.status(400).json({
      message: 'Please enter a valid username and password',
    });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const course = await Course.find();
    res.send(course);
  } catch (error) {
    console.log(error);
  }
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
  try {
    const course = await Course.find({
      _id: req.params.courseId,
    });

    const user = req.user;
    if (course) {
      const purchasedCourses = [...user.purchasedCoursesId];

      let checkCourseExist = purchasedCourses.find(
        (course) => course === req.params.courseId
      );
      if (!checkCourseExist) {
        purchasedCourses.push(req.params.courseId);
        user.purchasedCoursesId = purchasedCourses;
      } else {
        return res.send('course already purchased');
      }
      await user.save();
      res.send(course);
    }
  } catch (error) {
    console.log(error);
    res.send('Incorrect courseId');
  }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const purchasedCourses = [...user.purchasedCoursesId];
    const course = await Course.find({
      _id: purchasedCourses,
    });
    res.send(course);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
