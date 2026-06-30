import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export interface EnvStatus {
    variable: string
    exists: boolean
    value?: string
}

export class EnvValidator {

    private getEnvPath(): string | null {
        const workspaceFolders = vscode.workspace.workspaceFolders
        if (!workspaceFolders) return null
        const root = workspaceFolders[0].uri.fsPath
        const envPath = path.join(root, '.env')
        return fs.existsSync(envPath) ? envPath : null
    }

    validate(variables: string[]): EnvStatus[] {
        const envPath = this.getEnvPath()
        const envVars = new Map<string, string>()

        if (envPath) {
            const content = fs.readFileSync(envPath, 'utf-8')
            const lines = content.split('\n')
            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=')
                    if (key) {
                        envVars.set(key.trim(), valueParts.join('=').trim())
                    }
                }
            }
        }

        return variables.map(variable => ({
            variable,
            exists: envVars.has(variable),
            value: envVars.get(variable)
        }))
    }

    async generateEnvFile(variables: string[]): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders
        if (!workspaceFolders) return

        const root = workspaceFolders[0].uri.fsPath
        const envPath = path.join(root, '.env')

        // Se já existe, não sobrescreve — só adiciona as que faltam
        const existing = new Map<string, string>()
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8')
            const lines = content.split('\n')
            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=')
                    if (key) existing.set(key.trim(), valueParts.join('=').trim())
                }
            }
        }

        // Gera conteúdo
        let content = `# Gerado pelo Albertool Sentinel\n# ${new Date().toLocaleString('pt-BR')}\n\n`

        for (const variable of variables) {
            if (existing.has(variable)) {
                content += `${variable}=${existing.get(variable)}\n`
            } else {
                content += `${variable}=\n`
            }
        }

        fs.writeFileSync(envPath, content, 'utf-8')

        const doc = await vscode.workspace.openTextDocument(envPath)
        await vscode.window.showTextDocument(doc)

        vscode.window.showInformationMessage('🛡️ Sentinel: .env gerado com sucesso!')
    }
}