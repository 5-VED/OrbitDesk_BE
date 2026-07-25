/**
 * @swagger
 * components:
 *   schemas:
 *     AgentRating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the rating
 *         ticket_id:
 *           type: string
 *           description: Reference to the ticket
 *         agent_id:
 *           type: string
 *           description: Reference to the agent being rated
 *         rated_by:
 *           type: string
 *           description: Reference to the user who submitted the rating
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating score (1-5)
 *         feedback:
 *           type: string
 *           description: Optional feedback text
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     AgentRatingStats:
 *       type: object
 *       properties:
 *         avgRating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         totalRatings:
 *           type: integer
 *           example: 12
 *         distribution:
 *           type: object
 *           properties:
 *             1:
 *               type: integer
 *             2:
 *               type: integer
 *             3:
 *               type: integer
 *             4:
 *               type: integer
 *             5:
 *               type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Agent Ratings
 *   description: Agent rating and feedback management
 */

/**
 * @swagger
 * /api/v1/ratings/ticket/{ticketId}:
 *   post:
 *     summary: Submit a rating for an agent on a ticket
 *     tags: [Agent Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agent_id
 *               - rating
 *             properties:
 *               agent_id:
 *                 type: string
 *                 description: Agent user ID to rate
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               feedback:
 *                 type: string
 *                 example: "Excellent service, very helpful!"
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Rating submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/AgentRating'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: Get the rating for a specific ticket
 *     tags: [Agent Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AgentRating'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/ratings/agent/{agentId}:
 *   get:
 *     summary: Get aggregated rating stats for an agent
 *     tags: [Agent Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent user ID
 *     responses:
 *       200:
 *         description: Agent rating stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AgentRatingStats'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Internal server error
 */
