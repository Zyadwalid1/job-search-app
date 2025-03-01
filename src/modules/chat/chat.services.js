import { ChatModel } from "../../models/chat.model.js";
import { CompanyModel } from "../../models/company.model.js";
import { isHROrOwner, isRegularUser } from "../../utils/helpers/user.helpers.js";

export const getChatHistoryService = async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;
  const chat = await ChatModel.findOne({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId }
    ]
  })
  .populate('senderId', 'firstName lastName profilePic.secure_url')
  .populate('receiverId', 'firstName lastName profilePic.secure_url')
  .populate('messages.senderId', 'firstName lastName profilePic.secure_url');

  if (!chat) {
    return res.json({
      message: "No chat history found",
      data: null
    });
  }

  return res.json({
    message: "Chat history retrieved successfully",
    data: chat
  });
};
export const isHROrOwner = async (userId) => {
  const company = await CompanyModel.findOne({
    $or: [{ createdBy: userId }, { hrs: userId }]
  });
  return !!company;
};

export const isRegularUser = async (userId) => {
  const isHR = await isHROrOwner(userId);
  return !isHR;
}; 