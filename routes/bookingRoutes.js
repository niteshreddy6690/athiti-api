import { Router } from "express";
import booKingController from "../controllers/bookingsController.js"

const router = Router()

router.get("/",booKingController.getAllBookings)
router.post("/",booKingController.createBooking)
router.get("/:id",booKingController.getBookingById)
router.post("/:id",booKingController.updateBookingById)

export default router