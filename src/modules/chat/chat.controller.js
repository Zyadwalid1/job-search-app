import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getChatHistoryService } from "./chat.services.js";

const router = Router();

router.get(
  "/:userId",
  asyncHandler(isAuthenticated),
  asyncHandler(getChatHistoryService)
);

export default router; 