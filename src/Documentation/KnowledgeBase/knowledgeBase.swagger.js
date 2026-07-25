/**
 * @swagger
 * components:
 *   schemas:
 *     KBCategory:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         icon:
 *           type: string
 *           default: Folder
 *           description: Icon identifier for the category
 *         color:
 *           type: string
 *           default: '#3b82f6'
 *           description: Color hex code for the category
 *         slug:
 *           type: string
 *           description: URL-friendly slug
 *         order:
 *           type: integer
 *           default: 0
 *           description: Display order
 *         organization_id:
 *           type: string
 *           description: Reference to the organization
 *         is_active:
 *           type: boolean
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     KBArticle:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the article
 *         title:
 *           type: string
 *           description: Article title
 *         slug:
 *           type: string
 *           description: URL-friendly slug
 *         content:
 *           type: string
 *           description: Article body content
 *         category:
 *           type: string
 *           description: Reference to the category
 *         author:
 *           type: string
 *           description: Reference to the author user
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Article tags
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           default: draft
 *         is_featured:
 *           type: boolean
 *           default: false
 *         views:
 *           type: integer
 *           default: 0
 *           description: View count
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
 *   name: Knowledge Base
 *   description: Knowledge base categories and articles management
 */

/**
 * @swagger
 * /api/v1/kb/categories:
 *   post:
 *     summary: Create a new knowledge base category
 *     tags: [Knowledge Base]
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
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Getting Started"
 *               description:
 *                 type: string
 *                 example: "Articles for new users"
 *               icon:
 *                 type: string
 *                 default: Folder
 *               color:
 *                 type: string
 *                 default: '#3b82f6'
 *               slug:
 *                 type: string
 *                 example: "getting-started"
 *               order:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: Category created successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBCategory'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: Get all knowledge base categories
 *     tags: [Knowledge Base]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                   example: Categories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/KBCategory'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/kb/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
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
 *                   example: Category retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBCategory'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error

 *   patch:
 *     summary: Update a category
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *               slug:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *                   example: Category updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBCategory'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Delete a category
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   example: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/kb/articles:
 *   post:
 *     summary: Create a new knowledge base article
 *     tags: [Knowledge Base]
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
 *               - slug
 *               - category
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to reset your password"
 *               slug:
 *                 type: string
 *                 example: "how-to-reset-your-password"
 *               category:
 *                 type: string
 *                 description: Category ID
 *               content:
 *                 type: string
 *                 example: "To reset your password, go to Settings > Security > Change Password..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["password", "security", "account"]
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 default: draft
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Article created successfully
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
 *                   example: Article created successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBArticle'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error

 *   get:
 *     summary: List articles with pagination and filters
 *     tags: [Knowledge Base]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
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
 *                   example: Articles retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/KBArticle'
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
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/kb/articles/{id}:
 *   get:
 *     summary: Get an article by ID or slug
 *     tags: [Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID or slug
 *     responses:
 *       200:
 *         description: Article retrieved successfully
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
 *                   example: Article retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBArticle'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error

 *   patch:
 *     summary: Update an article
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Article updated successfully
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
 *                   example: Article updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/KBArticle'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error

 *   delete:
 *     summary: Delete an article
 *     tags: [Knowledge Base]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
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
 *                   example: Article deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
