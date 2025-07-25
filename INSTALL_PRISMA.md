# Prisma Kurulum Rehberi

Bu dosya, Prisma'nın nasıl kurulacağını ve veritabanı bağlantısının nasıl yapılandırılacağını açıklar.

## 1. Prisma ve Gerekli Paketleri Kurun

```bash
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## 2. Prisma'yı Başlatın

```bash
npx prisma init
```

Bu komut zaten oluşturduğumuz `prisma/schema.prisma` dosyasını kullanacak.

## 3. PostgreSQL Veritabanı Oluşturun

PostgreSQL'de yeni bir veritabanı oluşturun:

```bash
createdb oxiva_store
```

## 4. .env.local Dosyasını Güncelleyin

`.env.local` dosyasındaki DATABASE_URL'i kendi PostgreSQL bilgilerinizle güncelleyin:

```
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/oxiva_store?schema=public
```

## 5. JWT Secret Ekleyin

`.env.local` dosyasına JWT secret ekleyin:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 6. Veritabanı Migration'ını Çalıştırın

```bash
npx prisma migrate dev --name init
```

## 7. Prisma Client'ı Generate Edin

```bash
npx prisma generate
```

## 8. İlk Admin Kullanıcısını Oluşturun

`prisma/seed.ts` dosyası oluşturun:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

`package.json` dosyasına seed komutu ekleyin:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Seed'i çalıştırın:

```bash
npx prisma db seed
```

## 9. Prisma Studio'yu Açın (İsteğe Bağlı)

Veritabanınızı görsel olarak incelemek için:

```bash
npx prisma studio
```

## Notlar

- Admin paneline giriş yapmak için: `admin@oxiva.com` / `admin123`
- Production'da JWT_SECRET'i güçlü bir değerle değiştirin
- Production'da DATABASE_URL'i gerçek veritabanı bilgilerinizle güncelleyin