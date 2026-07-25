const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flick API Documentation',
      version: '1.0.0',
      description: 'API documentation for Flick application',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.flick.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Roles',
        description: 'Role management API',
      },
      {
        name: 'Organizations',
        description: 'Organization management API',
      },
      {
        name: 'Groups',
        description: 'Group management API',
      },
      {
        name: 'Tickets',
        description: 'Ticket management API',
      },
      {
        name: 'AI',
        description: 'AI-powered assistance endpoints',
      },
      {
        name: 'Knowledge Base',
        description: 'Knowledge base categories and articles management',
      },
      {
        name: 'SLA Policies',
        description: 'Service Level Agreement policy management',
      },
      {
        name: 'Agent Ratings',
        description: 'Agent rating and feedback management',
      },
      {
        name: 'Audit Logs',
        description: 'Audit log management and export',
      },
      {
        name: 'Conversations',
        description: 'Conversation management API',
      },
    ],
  },
  apis: ['./src/Documentation/**/*.js', './src/Models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
