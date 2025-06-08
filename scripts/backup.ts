import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(process.cwd(), 'backups')
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  try {
    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    // Parse database URL
    const url = new URL(dbUrl)
    const dbName = url.pathname.slice(1)
    const dbUser = url.username
    const dbPassword = url.password
    const dbHost = url.hostname
    const dbPort = url.port || '5432'

    // Create backup command
    const backupCommand = `PGPASSWORD=${dbPassword} pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f ${backupFile}`

    // Execute backup
    await execAsync(backupCommand)
    console.log(`Backup created successfully: ${backupFile}`)

    // Clean up old backups (keep last 7 days)
    const files = fs.readdirSync(backupDir)
    const oldFiles = files
      .filter(file => file.startsWith('backup-'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time)
      .slice(7)

    for (const file of oldFiles) {
      fs.unlinkSync(file.path)
      console.log(`Deleted old backup: ${file.name}`)
    }
  } catch (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  backup()
}
if (require.main === module) {
  backupDatabase()
}

export { backupDatabase } 