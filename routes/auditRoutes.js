import { Router } from "express";
import auditController from "../controllers/auditController.js";

const router = Router();

router.get("/", auditController.getAllAudits);
router.post("/", auditController.createAudit); // Create a new audit for a room and the guest
router.get("/:id", auditController.getAuditById);
router.put("/:id", auditController.updateAuditById);
router.delete("/:id", auditController.deleteAuditById);
router.get("/room/:roomId", auditController.getAllAuditsByRoomId);


export default router;


