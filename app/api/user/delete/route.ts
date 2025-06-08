import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Delete user and all associated data (accounts, sessions, curriculums)
    // Prisma's cascade delete should handle accounts, sessions, and curriculums
    // if configured correctly in the schema. Let's verify the schema has onDelete: Cascade.
    // (Checked schema.prisma, relations have onDelete: Cascade)

    console.log(`Attempting to delete user with ID: ${userId}`)

    await prisma.user.delete({
      where: {
        id: userId
      }
    })

    console.log(`User with ID: ${userId} deleted successfully.`)

    return NextResponse.json({ message: 'Account and all associated data deleted successfully' })

  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 