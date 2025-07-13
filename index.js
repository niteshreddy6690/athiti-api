import express from "express";  
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import RoomRoutes from "./routes/roomsRoutes.js";
import GuestRoutes from "./routes/guestRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";  
import RoomProductRoutes from "./routes/roomProductRoutes.js";
import AuditRoutes from "./routes/auditRoutes.js";
import AuditItemRoutes from "./routes/auditItemRoutes.js"; // Assuming you have a route for audit items
import BookingRoutes from "./routes/bookingRoutes.js"

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  
dotenv.config();

app.use((err, req, res, next) => {
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});



connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Successfully connected to Data Base");
  })
  .catch((err) => console.log(err?.message));


app.use("/api/room", RoomRoutes);
app.use("/api/guest", GuestRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/room-product", RoomProductRoutes);
app.use("/api/audit", AuditRoutes);
app.use("/api/audit-item", AuditItemRoutes); 
app.use("/api/booking",BookingRoutes)


// app.get("/", (req, res) => {
//   res.send("Welcome to the API");
// });


app.listen(process.env.PORT || 8080, () => {
  console.log("server is running on Port :", process.env.PORT || 8080);
});