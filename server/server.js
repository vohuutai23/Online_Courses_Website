import express from "express";
import { usersRoutes } from "./routes/usersRoutes.js";
import { authsRoutes } from "./routes/authsRoutes.js";
import mongoose from "mongoose";
import passport from "./passport.js";
import cors from "cors";
import cookieSession from "cookie-session";
import { coursesRoutes } from "./routes/coursesRoutes.js";
import { cartsRoutes } from "./routes/cartsRouter.js";
import { lessonsRoutes } from "./routes/lessonsRoutes.js";
import { documentsRoutes } from "./routes/documentsRoutes.js";
import { commentsRoutes } from "./routes/commentsRoutes.js";
import { invoicesRoutes } from "./routes/invoicesRoutes.js";
import { reviewsRoutes } from "./routes/reviewsRoutes.js";
import { invoiceItemsRoutes } from "./routes/invoiceItemsRoutes.js";

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "200mb" }));

app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/invoiceItems", invoiceItemsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/auth", authsRoutes);

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "cookiedu_db" })
  .then(() => {
    console.log("Connected to the database");
    const port = process.env.PORT || 5000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database: ", error);
  });
