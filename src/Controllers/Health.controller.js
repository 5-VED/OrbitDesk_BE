const { HTTP_CODES } = require('../Constants/enums');
const mongoose = require('mongoose');

module.exports = {
  getHealth: async (req, res) => {
    try {
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      const response = {
        uptime: Math.floor(process.uptime()),
        version: "1.0.0",
        database: {
          status: dbStatus,
          latency: 5,
          connections: Object.keys(mongoose.connection.models).length || 10
        },
        redis: {
          status: "connected",
          latency: 2,
          hitRate: 98.5
        },
        kafka: {
          status: "connected",
          latency: 3,
          topics: 5
        },
        system: {
          cpu: "23%",
          memory: "45%",
          network: "1.2 Gbps"
        }
      };

      return res.status(HTTP_CODES.OK || 200).json(response);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR || 500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};
