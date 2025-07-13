import { Router    } from "express";

import roomProductController from "../controllers/roomProductController.js";
const router = Router();
router.post("/", roomProductController.createRoomProduct);
router.get("/:id", roomProductController.getRoomProductById);
router.post("/:id", roomProductController.updateRoomProductById);
router.delete("/:id", roomProductController.deleteRoomProductById);
router.get("/", roomProductController.getAllRoomProducts);
router.get("/room/:roomId", roomProductController.getAllRoomProductsByRoomId);

export default router;