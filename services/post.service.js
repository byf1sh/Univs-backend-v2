const { prisma } = require("../models");

module.exports = {
  findAll: async () => {
    return await prisma.post.findMany({
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
          },
        },
      },
    });
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
          },
        },
      },
    });
  },
  findByUser: async (id) => {
    return await prisma.post.findMany({
      where: { userId: parseInt(id) },
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
          },
        },
      },
    });
  },
  store: async (data) => {
    return await prisma.post.create({ data });
  },
  destroy: async (id) => {
    id = parseInt(id);
    return await prisma.post.delete({ where: { id } });
  },
};
