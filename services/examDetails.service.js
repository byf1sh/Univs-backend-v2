const { prisma } = require("../models");

module.exports = {
  store: async (data) => {
    return await prisma.examDetails.create({ data });
  },
};
