import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const initialSubjectStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  topics: {}
};

const initialProgress = {
  math: { ...initialSubjectStats },
  science: { ...initialSubjectStats },
  language: { ...initialSubjectStats },
  reading: { ...initialSubjectStats },
  recentAttempts: []
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await prisma.progress.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!progress) {
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