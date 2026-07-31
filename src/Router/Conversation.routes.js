const router = require('express').Router();
const ConversationController = require('../Controllers/Conversation.controller');

// Routes mapped to pendingApi.md specifications
router.post('/add-conversation', ConversationController.addConversation);
router.get('/get', ConversationController.getConversations);
router.put('/edit', ConversationController.editConversation);
router.put('/delete', ConversationController.deleteConversation);

module.exports = router;
