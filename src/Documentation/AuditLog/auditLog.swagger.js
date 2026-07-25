/**
 * @swagger
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the audit log entry
 *         user_id:
 *           type: string
 *           description: Reference to the user who performed the action
 *         user_name:
 *           type: string
 *           default: System
 *           description: Name of the user
 *         user_role:
 *           type: string
 *           default: system
 *           description: Role of the user
 *         action:
 *           type: string
 *           description: Action performed (e.g., Created, Updated, Deleted)
 *         resource:
 *           type: string
 *           description: Resource type (e.g., User, Ticket, SLA Policy)
 *         target:
 *           type: string
 *           description: Target identifier or description
 *         category:
 *           type: string
 *           enum: [user, security, policy, data, automation, notification, settings]
 *           default: data
 *           description: Audit log category
 *         ip_address:
 *           type: string
 *           default: '—'
 *           description: IP address of the requester
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         organization_id:
 *           type: string
 *           description: Reference to the organization
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Audit log management and export
 */

/**
 * @swagger
 * /api/v1/audit-logs:
 *   get:
 *     summary: List audit logs with filters and pagination
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in user name, action, resource, and target
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [user, security, policy, data, automation, notification, settings]
 *         description: Filter by audit category
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AuditLog'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/audit-logs/export:
 *   get:
 *     summary: Export audit logs as CSV
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [user, security, policy, data, automation, notification, settings]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
