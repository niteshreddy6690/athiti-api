import { Router } from "express";
import  guestController from "../controllers/guestController.js";

const router = Router();
router.post("/", guestController.createGuest);
router.get("/:id", guestController.getGuestById);
router.get("/", guestController.getAllGuests);
router.post("/:id", guestController.updateGuestById);
router.delete("/:id", guestController.deleteGuestById);
router.post("/:id/checkin", guestController.checkInGuest);
router.post("/:id/checkout", guestController.checkOutGuest);
router.get("/all/guestAudits",guestController.getGuestsRoomsAuditStatus)

 

export default router;
