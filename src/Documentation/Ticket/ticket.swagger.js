/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - subject
 *         - description
 *         - requester_id
 *         - submitter_id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the ticket
 *         subject:
 *           type: string
 *           description: Ticket subject
 *         description:
 *           type: string
 *           description: Ticket description
 *         status:
 *           type: string
 *           enum: [new, open, pending, hold, solved, closed]
 *           default: new
 *         priority:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *           default: normal
 *         type:
 *           type: string
 *           enum: [question, incident, problem, task]
 *           default: question
 *         channel:
 *           type: string
 *           enum: [email, web, api, chat, phone]
 *           default: email
 *         requester_id:
 *           type: string
 *           description: Reference to the requester user
 *         submitter_id:
 *           type: string
 *           description: Reference to the submitter user
 *         assignee_id:
 *           type: string
 *           description: Reference to the assigned agent
 *         group_id:
 *           type: string
 *           description: Reference to the assigned group
 *         organization_id:
 *           type: string
 *           description: Reference to the organization
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Ticket tags
 *         custom_fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field_id:
 *                 type: string
 *               value:
 *                 type: object
 *         sla_policy_id:
 *           type: string
 *           description: Reference to the SLA policy
 *         sla_breach_at:
 *           type: string
 *           format: date-time
 *           description: When SLA was breached
 *         response_due_at:
 *           type: string
 *           format: date-time
 *           description: First response due time
 *         resolve_due_at:
 *           type: string
 *           format: date-time
 *           description: Resolution due time
 *         first_response_at:
 *           type: string
 *           format: date-time
 *           description: When first response was sent
 *         solved_at:
 *           type: string
 *           format: date-time
 *           description: When the ticket was solved
 *         is_active:
 *           type: boolean
 *           default: true
 *         is_deleted:
 *           type: boolean
 *           default: false
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     TicketComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         ticket_id:
 *           type: string
 *           description: Reference to the ticket
 *         author_id:
 *           type: string
 *           description: Reference to the comment author
 *         body:
 *           type: string
 *           description: Comment body text
 *         html_body:
 *           type: string
 *           description: HTML formatted body
 *         public:
 *           type: boolean
 *           default: true
 *           description: Whether the comment is public
 *         visibility:
 *           type: string
 *           enum: [public, internal]
 *           default: public
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               url:
 *                 type: string
 *               mime_type:
 *                 type: string
 *               size:
 *                 type: number
 *         metadata:
 *           type: object
 *           description: Additional metadata key-value map
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
 *   name: Tickets
 *   description: Ticket management API
 */

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *                 example: "Cannot login to my account"
 *               description:
 *                 type: string
 *                 example: "I've been trying to login for the past hour but keep getting an error."
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *                 example: "high"
 *               type:
 *                 type: string
 *                 enum: [question, incident, problem, task]
 *                 example: "incident"
 *               channel:
 *                 type: string
 *                 enum: [email, web, api, chat, phone]
 *                 example: "web"
 *               requester_id:
 *                 type: string
 *                 description: Requester user ID (defaults to current user)
 *               assignee_id:
 *                 type: string
 *                 description: Agent to assign the ticket to
 *               group_id:
 *                 type: string
 *                 description: Group to assign the ticket to
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["login", "urgent"]
 *     responses:
 *       201:
 *         description: Ticket created successfully
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
 *                   example: Ticket created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: List tickets with filters and pagination
 *     tags: [Tickets]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, open, pending, hold, solved, closed]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *         description: Filter by priority
 *       - in: query
 *         name: assignee_id
 *         schema:
 *           type: string
 *         description: Filter by assignee
 *       - in: query
 *         name: group_id
 *         schema:
 *           type: string
 *         description: Filter by group
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in subject and description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
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
 *                   example: Tickets retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     tickets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ticket'
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
 * /api/v1/tickets/bulk-update:
 *   post:
 *     summary: Bulk update tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_ids
 *               - updates
 *             properties:
 *               ticket_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of ticket IDs to update
 *               updates:
 *                 type: object
 *                 description: Fields to update on all selected tickets
 *                 properties:
 *                   status:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   assignee_id:
 *                     type: string
 *                   group_id:
 *                     type: string
 *     responses:
 *       200:
 *         description: Tickets updated successfully
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 * /api/v1/tickets/bulk-delete:
 *   delete:
 *     summary: Bulk soft-delete tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_ids
 *             properties:
 *               ticket_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of ticket IDs to delete
 *     responses:
 *       200:
 *         description: Tickets deleted successfully
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
 *                   example: Ticket deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   get:
 *     summary: Get ticket details by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details retrieved successfully
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
 *                   example: Ticket details retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error

 *   patch:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [new, open, pending, hold, solved, closed]
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *               type:
 *                 type: string
 *                 enum: [question, incident, problem, task]
 *               assignee_id:
 *                 type: string
 *               group_id:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Soft-delete a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
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
 *                   example: Ticket deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/tickets/{id}/status:
 *   patch:
 *     summary: Update ticket status
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, open, pending, hold, solved, closed]
 *                 example: open
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error

 * /api/v1/tickets/{id}/priority:
 *   patch:
 *     summary: Update ticket priority
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - priority
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *                 example: urgent
 *     responses:
 *       200:
 *         description: Ticket priority updated successfully
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid priority value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error

 * /api/v1/tickets/{id}/assign:
 *   patch:
 *     summary: Assign or reassign a ticket to an agent
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - assignee_id
 *             properties:
 *               assignee_id:
 *                 type: string
 *                 description: Agent user ID to assign the ticket to
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
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
 *                   example: Ticket updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid assignee ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/tickets/{id}/comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 description: Comment text
 *                 example: "I've checked the issue and it looks like a server timeout."
 *               public:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the comment is visible to the requester
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     url:
 *                       type: string
 *                     mime_type:
 *                       type: string
 *                     size:
 *                       type: number
 *     responses:
 *       201:
 *         description: Comment added successfully
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
 *                   example: Comment added successfully
 *                 data:
 *                   $ref: '#/components/schemas/TicketComment'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: Get all comments for a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                   example: Conversation retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TicketComment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/tickets/{id}/comments/{commentId}:
 *   patch:
 *     summary: Edit a comment
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *                   example: Comment updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/TicketComment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only edit your own comments
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Delete a comment
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You can only delete your own comments
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
