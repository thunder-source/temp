const { Router } = require('express');
const adminMiddleware = require('../middleware/admin');
const router = Router();
const zod = require('zod');
const { Admin, Course } = require('../db/index.js');
var jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

// Admin Routes
router.post('/signup', async (req, res) => {
  const username = zod.string().email().safeParse(req.body.username);
  const password = zod.string().min(8).max(30).safeParse(req.body.password);

  if (username.success && password.success) {
    try {
      const user = await Admin.create({
        username: req.body.username,
        password: req.body.password,
      });
      if (user) {
        res.json({
          message: 'Admin created successfully',
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
      const user = await Admin.find({
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

router.post('/courses', adminMiddleware, async (req, res) => {
  const title = zod.string().safeParse(req.body.title);
  const description = zod.string().safeParse(req.body.description);
  const price = zod.number().safeParse(req.body.price);
  const imageLink = zod.string().safeParse(req.body.imageLink);

  if (title && description && price && imageLink) {
    try {
      const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageLink: req.body.imageLink,
      });
      if (course) {
        res.send({
          message: 'Course created successfully',
          courseId: course.courseId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send('Enter all information');
  }
});

router.get('/courses', adminMiddleware, async (req, res) => {
  try {
    const course = await Course.find();
    res.send(course);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
