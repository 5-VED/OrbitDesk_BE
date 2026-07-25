/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the organization
 *         name:
 *           type: string
 *           description: The name of the organization
 *         domains:
 *           type: array
 *           items:
 *             type: string
 *           description: Allowed email domains for the organization
 *         details:
 *           type: object
 *           description: Additional organization details as key-value map
 *         settings:
 *           type: object
 *           properties:
 *             allow_external_sharing:
 *               type: boolean
 *               default: false
 *             default_locale:
 *               type: string
 *               default: en-US
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
 */

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management API
 */

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corp"
 *               domains:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["acme.com"]
 *               details:
 *                 type: object
 *                 example: { industry: "Technology" }
 *               settings:
 *                 type: object
 *                 properties:
 *                   allow_external_sharing:
 *                     type: boolean
 *                   default_locale:
 *                     type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
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
 *                   example: Organization created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: List all organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
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
 *                   example: Organizations retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Organization'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   patch:
 *     summary: Update an organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               domains:
 *                 type: array
 *                 items:
 *                   type: string
 *               details:
 *                 type: object
 *               settings:
 *                 type: object
 *                 properties:
 *                   allow_external_sharing:
 *                     type: boolean
 *                   default_locale:
 *                     type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
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
 *                   example: Organization updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
