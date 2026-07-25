/**
 * @swagger
 * components:
 *   schemas:
 *     SlaPolicy:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the SLA policy
 *         title:
 *           type: string
 *           description: Policy title
 *         description:
 *           type: string
 *           description: Policy description
 *         is_active:
 *           type: boolean
 *           default: true
 *         is_default:
 *           type: boolean
 *           default: false
 *         position:
 *           type: integer
 *           default: 0
 *           description: Display order position
 *         filter:
 *           type: object
 *           description: Matching criteria for ticket assignment
 *         policy_metrics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               target:
 *                 type: string
 *                 description: Human-readable target time
 *                 example: "4 hours"
 *               target_minutes:
 *                 type: integer
 *                 description: Target time in minutes
 *         is_deleted:
 *           type: boolean
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     SlaMetrics:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 150
 *         open:
 *           type: integer
 *           example: 45
 *         pending:
 *           type: integer
 *           example: 10
 *         solved:
 *           type: integer
 *           example: 90
 *         resolvedToday:
 *           type: integer
 *           example: 5
 *         overdue:
 *           type: integer
 *           example: 3
 *         breachesToday:
 *           type: integer
 *           example: 1
 *     SlaDashboardStats:
 *       type: object
 *       properties:
 *         firstResponseCompliance:
 *           type: integer
 *           example: 85
 *         resolutionCompliance:
 *           type: integer
 *           example: 78
 *         avgResponseMinutes:
 *           type: integer
 *           example: 45
 *         totalWithSla:
 *           type: integer
 *           example: 120
 *         countsByPolicy:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               total:
 *                 type: integer
 *               breached:
 *                 type: integer
 *               resolvedOnTime:
 *                 type: integer
 *               resolved:
 *                 type: integer
 */

/**
 * @swagger
 * tags:
 *   name: SLA Policies
 *   description: Service Level Agreement policy management
 */

/**
 * @swagger
 * /api/v1/sla:
 *   post:
 *     summary: Create a new SLA policy
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Standard Support"
 *               description:
 *                 type: string
 *                 example: "Standard support SLA for general inquiries"
 *               is_default:
 *                 type: boolean
 *                 default: false
 *               filter:
 *                 type: object
 *                 description: Matching criteria
 *                 example: { type: "question", channel: "email" }
 *               policy_metrics:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     priority:
 *                       type: string
 *                       enum: [low, normal, high, urgent]
 *                     target:
 *                       type: string
 *                     target_minutes:
 *                       type: integer
 *                 example:
 *                   - priority: low
 *                     target: "24 hours"
 *                     target_minutes: 1440
 *                   - priority: normal
 *                     target: "8 hours"
 *                     target_minutes: 480
 *                   - priority: high
 *                     target: "4 hours"
 *                     target_minutes: 240
 *                   - priority: urgent
 *                     target: "1 hour"
 *                     target_minutes: 60
 *     responses:
 *       201:
 *         description: SLA policy created successfully
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
 *                   example: SLA policy created successfully
 *                 data:
 *                   $ref: '#/components/schemas/SlaPolicy'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: List all SLA policies
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SLA policies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SlaPolicy'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/sla/reorder:
 *   post:
 *     summary: Reorder SLA policies
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderedIds
 *             properties:
 *               orderedIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Policy IDs in desired order
 *     responses:
 *       200:
 *         description: Policies reordered successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/sla/metrics:
 *   get:
 *     summary: Get ticket metrics for the organization
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SlaMetrics'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 * /api/v1/sla/dashboard-stats:
 *   get:
 *     summary: Get SLA compliance dashboard statistics
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SlaDashboardStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/sla/{id}:
 *   get:
 *     summary: Get an SLA policy by ID
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SLA Policy ID
 *     responses:
 *       200:
 *         description: SLA policy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SlaPolicy'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: SLA policy not found
 *       500:
 *         description: Internal server error

 *   patch:
 *     summary: Update an SLA policy
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SLA Policy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               is_default:
 *                 type: boolean
 *               filter:
 *                 type: object
 *               policy_metrics:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     priority:
 *                       type: string
 *                     target:
 *                       type: string
 *                     target_minutes:
 *                       type: integer
 *     responses:
 *       200:
 *         description: SLA policy updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: SLA policy not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Delete an SLA policy
 *     tags: [SLA Policies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SLA Policy ID
 *     responses:
 *       200:
 *         description: SLA policy deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: SLA policy not found
 *       500:
 *         description: Internal server error
 */
