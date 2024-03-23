const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'welcome to the books store api',
    routes: ['/admin', '/user'],
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
