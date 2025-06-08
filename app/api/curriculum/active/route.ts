` tags.

```
Removing comments and updating the code as requested.
```

<replit_final_file>
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const curriculum = await prisma.curriculum.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!curriculum) {
      return NextResponse.json(null)
    }

    const allProgress = await prisma.progress.findMany({
      where: {
        userId: session.user.id
      }
    })

    const progressData = allProgress.reduce((acc, progress) => {
      acc[progress.lessonId] = {
        isCompleted: progress.isCompleted,
        lastQuestionIndex: progress.lastQuestionIndex,
        conversationHistory: progress.conversationHistory,
        updatedAt: progress.updatedAt.toISOString()
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      ...curriculum,
      progress: progressData
    })
  } catch (error) {
    console.error('Error fetching active curriculum:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}