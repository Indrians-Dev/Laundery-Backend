// require('dotenv').config();
// const mysql = require('mysql2');

// const pool = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         port: process.env.DB_PORT || 3306,
//         waitForConnections: true,
//         connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
//         queueLimit: process.env.DB_QUEUE_LIMIT || 0,
//         acquireTimeout: 60000,
//         timeout: 60000,
//         reconnect: true


// });

// const promisePool = pool.promise();

// const testConnection = async () => {
//   try {
//     const connection = await promisePool.getConnection();
//     console.log('✅ Connected to MySQL database successfully!');
//     connection.release();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     process.exit(1);
//   }
// };

// testConnection();

// module.exports = promisePool;





const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
   log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query',(e)=>{
  logger.e;
})

prisma.$on('error',(e)=>{
  logger.e;
})

prisma.$on('info',(e)=>{
  logger.e;
})
prisma.$on('warn',(e)=>{
  logger.e;
})


module.exports = prisma;
