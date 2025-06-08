import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract lessonId from query params
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Use composite unique key with userId and lessonId
    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        }
      }
    });

    if (!progress) {
      // Return empty/default progress object if none found
      return NextResponse.json({
        math: {},
        science: {},
        language: {},
        reading: {},
        attempts: []
      });
    }

    return NextResponse.json({
      math: JSON.parse(progress.math),
      science: JSON.parse(progress.science),
      language: JSON.parse(progress.language),
      reading: JSON.parse(progress.reading),
      attempts: JSON.parse(progress.attempts)
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Error fetching progress' }, { status: 500 });
  }
}
