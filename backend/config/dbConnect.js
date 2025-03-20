import mongoose from 'mongoose';

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.DB_URI)
    .then((result) => {
      console.log('CONNECTED TO DATABASE');
    })
    .catch((err) => {
      console.log('ERROR IN CONNECTING TO THE DATABASE');
    });
};

export default dbConnect;
