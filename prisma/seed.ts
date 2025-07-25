import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@oxiva.com' }
  })
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@oxiva.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: true
      }
    })
    
    console.log('Admin user created:', admin.email)
  } else {
    console.log('Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })