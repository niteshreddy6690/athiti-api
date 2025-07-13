import { Router } from "express";
import AuditItemController from "../controllers/auditItemController.js";

const router = Router();

router.get("/", AuditItemController.getAllAuditItems);
router.post("/", AuditItemController.createAuditItem); 
router.get("/:id", AuditItemController.getAuditItemById);
router.put("/:id", AuditItemController.updateAuditItemById);
router.delete("/:id", AuditItemController.deleteAuditItemById);
// router.get("/audit/:auditId", AuditItemController.getAllAuditItemsByAuditId); 
router.post("/bulk", AuditItemController.createAuditForMultipleItems); 
export default router;
