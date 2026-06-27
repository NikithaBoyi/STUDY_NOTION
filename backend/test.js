require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
