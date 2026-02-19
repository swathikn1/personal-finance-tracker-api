import { Router } from "express";
import { EntriesController } from "../controller/EntriesController";
import { authMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", EntriesController.createEntries);
router.get("/", EntriesController.getEntries);
router.get("/:id", EntriesController.getEntryById);
router.put("/:id", EntriesController.updateEntry);
router.delete("/:id", EntriesController.deleteEntry);

export default router;