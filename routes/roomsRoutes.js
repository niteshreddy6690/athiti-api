
import { Router } from "express";
import roomController from "../controllers/roomController.js";

const router = Router();
router.post("/",  roomController.createRoom);
router.get("/:id", roomController.getRoomById);
router.get("/", roomController.getAllRooms);
router.put("/:id",  roomController.updateRoomById);
router.delete("/:id",  roomController.deleteRoomById);   
router.get("/all/available", roomController.getAvailableRooms);
router.get("/by-status", roomController.getAvailableRooms);

export default router;