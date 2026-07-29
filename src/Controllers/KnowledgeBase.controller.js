const KnowledgeBaseService = require('../Services/KnowledgeBase/KnowledgeBase.service');
const AuditLogService = require('../Services/AuditLog.service');
const { HTTP_CODES } = require('../Constants/enums');
const messages = require('../Constants/messages');

const getIp = (req) => req.ip || req.headers['x-forwarded-for'] || '—';

module.exports = {
    // Categories
    createCategory: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.createCategory(req.body);

            AuditLogService.log({
                user: req.user, action: 'Created', resource: 'KB Category',
                target: req.body.name || '', category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.CREATED).json({
                success: true,
                message: "Category created successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    getCategories: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.getCategories(req.query);
            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Categories retrieved successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.getCategoryById(req.params.id);
            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Category not found",
                });
            }
            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Category retrieved successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.updateCategory(req.params.id, req.body);
            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Category not found",
                });
            }

            AuditLogService.log({
                user: req.user, action: 'Updated', resource: 'KB Category',
                target: result.name || req.params.id, category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Category updated successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.deleteCategory(req.params.id);
            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Category not found",
                });
            }

            AuditLogService.log({
                user: req.user, action: 'Deleted', resource: 'KB Category',
                target: req.params.id, category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Category deleted successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    // Articles
    createArticle: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.createArticle(req.body, req.user._id);

            AuditLogService.log({
                user: req.user, action: 'Created', resource: 'KB Article',
                target: req.body.title || '', category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.CREATED).json({
                success: true,
                message: "Article created successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    getArticles: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.getArticles(req.query);
            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Articles retrieved successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    getArticle: async (req, res) => {
        try {
            const { id } = req.params;
            let result;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                result = await KnowledgeBaseService.getArticle(id);
            } else {
                result = await KnowledgeBaseService.getArticleBySlug(id);
            }

            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Article not found",
                });
            }
            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Article retrieved successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    updateArticle: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.updateArticle(req.params.id, req.body);
            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Article not found",
                });
            }

            AuditLogService.log({
                user: req.user, action: 'Updated', resource: 'KB Article',
                target: result.title || req.params.id, category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Article updated successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },

    deleteArticle: async (req, res) => {
        try {
            const result = await KnowledgeBaseService.deleteArticle(req.params.id);
            if (!result) {
                return res.status(HTTP_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Article not found",
                });
            }

            AuditLogService.log({
                user: req.user, action: 'Deleted', resource: 'KB Article',
                target: req.params.id, category: 'data',
                ip: getIp(req), organizationId: req.user?.organization_id,
            });

            return res.status(HTTP_CODES.OK).json({
                success: true,
                message: "Article deleted successfully",
                data: result,
            });
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || messages.INTERNAL_SERVER_ERROR,
            });
        }
    },
};
