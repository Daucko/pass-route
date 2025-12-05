// Prisma configuration for Prisma 7
// This file contains the database connection configuration

export default {
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
};
