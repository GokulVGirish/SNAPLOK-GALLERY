import connectDB from "./frameworks/Db/db";
import app from "./frameworks/express/app";
connectDB();
app.listen(4000, () => {
  console.log("server listening");
});
