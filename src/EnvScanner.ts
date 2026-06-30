import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export class EnvScanner {

    // Escaneia o projeto inteiro e retorna todas as variáveis encontradas
    async scanVariables(): Promise<string[]> {
        const variables = new Set<string>()
        const workspaceFolders = vscode.workspace.workspaceFolders
        if (!workspaceFolders) return []

        const root = workspaceFolders[0].uri.fsPath

        // 1. Procura no env-config.ts (padrão Albertool/HydroRS)
        const envConfigVars = this.scanEnvConfig(root)
        envConfigVars.forEach(v => variables.add(v))

        // 2. Procura no .env.example
        const envExampleVars = this.scanEnvExample(root)
        envExampleVars.forEach(v => variables.add(v))

        // 3. Procura process.env.VARIAVEL em qualquer arquivo .ts/.js
        const processEnvVars = await this.scanProcessEnv(root)
        processEnvVars.forEach(v => variables.add(v))

        return Array.from(variables).sort()
    }

    private scanEnvConfig(root: string): string[] {
        const variables: string[] = []
        const possiblePaths = [
            'src/config/env-config.ts',
            'src/config/env-config.js',
            'Backend/config/env-config.ts',
            'Backend/config/env-config.js',
            'config/env-config.ts',
            'config/env-config.js',
        ]

        for (const p of possiblePaths) {
            const fullPath = path.join(root, p)
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf-8')
                // Pega variáveis do destructuring: export const { DB_HOST, DB_PORT } = process.env
                const destructRegex = /export\s+const\s*\{([^}]+)\}\s*=\s*process\.env/g
                let match
                while ((match = destructRegex.exec(content)) !== null) {
                    const vars = match[1]
                        .split(',')
                        .map(v => v.trim())
                        .filter(v => v.length > 0)
                    variables.push(...vars)
                }
            }
        }

        return variables
    }

    private scanEnvExample(root: string): string[] {
        const variables: string[] = []
        const envExamplePath = path.join(root, '.env.example')

        if (fs.existsSync(envExamplePath)) {
            const content = fs.readFileSync(envExamplePath, 'utf-8')
            const lines = content.split('\n')
            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed && !trimmed.startsWith('#')) {
                    const key = trimmed.split('=')[0].trim()
                    if (key) variables.push(key)
                }
            }
        }

        return variables
    }

    private async scanProcessEnv(root: string): Promise<string[]> {
        const variables: string[] = []
        const ignoredDirs = ['node_modules', '.git', 'out', 'dist', 'build', '.vscode']

        const scanDir = (dir: string, depth: number) => {
            if (depth > 6) return
            let entries: fs.Dirent[]
            try {
                entries = fs.readdirSync(dir, { withFileTypes: true })
            } catch { return }

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)
                if (entry.isDirectory()) {
                    if (ignoredDirs.includes(entry.name)) continue
                    scanDir(fullPath, depth + 1)
                } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8')
                        const regex = /process\.env\.([A-Z_][A-Z0-9_]*)/g
                        let match
                        while ((match = regex.exec(content)) !== null) {
                            variables.push(match[1])
                        }
                    } catch { continue }
                }
            }
        }

        scanDir(root, 0)
        return variables
    }
}