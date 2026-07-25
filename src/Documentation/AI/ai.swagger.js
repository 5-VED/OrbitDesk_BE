/**
 * @swagger
 * components:
 *   schemas:
 *     AIReply:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         reply:
 *           type: string
 *           example: "Thank you for reaching out. I understand you're having trouble logging in. Let me look into this for you."
 *     AISummary:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         summary:
 *           type: string
 *           example: "Customer is unable to login to their account due to a password reset issue. Agent has provided instructions for resetting the password."
 *     AISentiment:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         sentiment:
 *           type: object
 *           properties:
 *             score:
 *               type: number
 *               example: -0.7
 *             label:
 *               type: string
 *               example: "negative"
 *     AITags:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["login", "account", "authentication", "password"]
 */

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered assistance endpoints
 */

/**
 * @swagger
 * /api/v1/ai/generate-reply:
 *   post:
 *     summary: Generate an AI reply for a ticket
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: ID of the ticket
 *               ticketContent:
 *                 type: string
 *                 description: The customer's inquiry content
 *                 example: "My login is broken."
 *               context:
 *                 type: string
 *                 description: Additional context for generating the reply
 *     responses:
 *       200:
 *         description: AI reply generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIReply'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error generating reply"

 * /api/v1/ai/summarize:
 *   post:
 *     summary: Summarize a ticket conversation
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: ID of the ticket
 *               ticketConversation:
 *                 type: string
 *                 description: The conversation text to summarize
 *                 example: "Customer: My login is broken. Agent: Please try resetting your password."
 *     responses:
 *       200:
 *         description: Ticket summarized successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AISummary'
 *       500:
 *         description: Internal server error

 * /api/v1/ai/analyze-sentiment:
 *   post:
 *     summary: Analyze sentiment of a text
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to analyze for sentiment
 *                 example: "I'm extremely frustrated with your service!"
 *     responses:
 *       200:
 *         description: Sentiment analyzed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AISentiment'
 *       500:
 *         description: Internal server error

 * /api/v1/ai/suggest-tags:
 *   post:
 *     summary: Suggest tags for a ticket
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketContent:
 *                 type: string
 *                 description: The ticket content to generate tags for
 *                 example: "Customer reports inability to login after password reset."
 *     responses:
 *       200:
 *         description: Tags suggested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AITags'
 *       500:
 *         description: Internal server error
 */
