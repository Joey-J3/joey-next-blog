import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions, } from '@prisma/client/runtime';

let prisma: PrismaClient<PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ]
  })

  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  });

  prisma.$use(async (params, next) => {  // 记录接口时间
    const before = Date.now()
    const result = await next(params);
    const after = Date.now()
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

    return result
  })
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}


export default prisma;