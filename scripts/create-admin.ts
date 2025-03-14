import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function createAdmin() {
  return new Promise<void>((resolve) => {
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        try {
          // Hash the password
          const saltRounds = 10
          const hashedPassword = await bcrypt.hash(password, saltRounds)

          // Create admin user
          const admin = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              isActive: true
            }
          })

          console.log(`✅ Admin user created successfully with ID: ${admin.id}`)
          resolve()
        } catch (error) {
          console.error('❌ Error creating admin user:', error)
          resolve()
        } finally {
          rl.close()
          await prisma.$disconnect()
        }
      })
    })
  })
}

createAdmin()