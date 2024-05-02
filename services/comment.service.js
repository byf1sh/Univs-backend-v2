const { prisma } = require("../models");

module.exports = {
  store: async (data) => {
    return await prisma.comment.create({ data });
  },
  destroy: async (id) => {
    id = parseInt(id);
    return await prisma.comment.delete({ where: { id } });
  },
};
