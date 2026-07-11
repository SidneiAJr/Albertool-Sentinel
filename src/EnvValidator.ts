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

   async generateEnvFileLite(variables: string[]): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders) return

    const root = workspaceFolders[0].uri.fsPath
    const envPath = path.join(root, '.env')
    const now = new Date().toLocaleString('pt-BR')

    const content = `# Gerado pelo Albertool Sentinel (Lite)
# ${now}

PORT=
NODE_ENV=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=
`

    fs.writeFileSync(envPath, content, 'utf-8')
    const doc = await vscode.workspace.openTextDocument(envPath)
    await vscode.window.showTextDocument(doc)
    vscode.window.showInformationMessage('🛡️ Sentinel: .env Lite gerado com sucesso!')
}

    async generateEnvFile(variables: string[]): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders
        if (!workspaceFolders) return

        const root = workspaceFolders[0].uri.fsPath
        const envPath = path.join(root, '.env')
        const now = new Date().toLocaleString('pt-BR')

        const fixedVars = new Set([
            'NODE_ENV', 'PORT', 'APP_NAME', 'APP_URL', 'APP_VERSION',
            'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
            'DB_SCHEMA', 'DB_SYNC', 'DB_LOGGING', 'DB_SSL',
            'JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_REFRESH_SECRET',
            'JWT_REFRESH_EXPIRES_IN', 'BCRYPT_ROUNDS',
            'REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD', 'REDIS_DB', 'REDIS_TTL',
            'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASSWORD', 'MAIL_FROM', 'MAIL_SECURE',
            'STORAGE_DRIVER', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
            'AWS_REGION', 'AWS_BUCKET', 'AWS_ENDPOINT',
            'LOG_LEVEL', 'LOG_FORMAT', 'SENTRY_DSN', 'NEW_RELIC_KEY',
            'WEBHOOK_SECRET', 'CORS_ORIGIN', 'RATE_LIMIT_MAX', 'RATE_LIMIT_WINDOW'
        ])

        const extraVars = variables.filter(v => !fixedVars.has(v))

        let content = `#################################################################
#             GERADO PELO ALBERTOOL SENTINEL                    #
#             ${now.padEnd(45)}#
#             NÃO COMMITAR ESTE ARQUIVO NO GIT                  #
#################################################################

# ---------------------------------------------------------------
# 🌐 APLICAÇÃO
# ---------------------------------------------------------------
NODE_ENV=
PORT=
APP_NAME=
APP_URL=
APP_VERSION=

# ---------------------------------------------------------------
# 🗄️ BANCO DE DADOS
# ---------------------------------------------------------------
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_SCHEMA=
DB_SYNC=
DB_LOGGING=
DB_SSL=

# ---------------------------------------------------------------
# 🔐 AUTENTICAÇÃO & SEGURANÇA
# ---------------------------------------------------------------
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
BCRYPT_ROUNDS=

# ---------------------------------------------------------------
# 📦 CACHE & FILAS
# ---------------------------------------------------------------
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_DB=
REDIS_TTL=

# ---------------------------------------------------------------
# 📧 E-MAIL
# ---------------------------------------------------------------
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
MAIL_SECURE=

# ---------------------------------------------------------------
# ☁️ STORAGE / S3
# ---------------------------------------------------------------
STORAGE_DRIVER=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET=
AWS_ENDPOINT=

# ---------------------------------------------------------------
# 📊 LOGS & MONITORAMENTO
# ---------------------------------------------------------------
LOG_LEVEL=
LOG_FORMAT=
SENTRY_DSN=
NEW_RELIC_KEY=

# ---------------------------------------------------------------
# 🔗 INTEGRAÇÕES EXTERNAS
# ---------------------------------------------------------------
WEBHOOK_SECRET=
CORS_ORIGIN=
RATE_LIMIT_MAX=
RATE_LIMIT_WINDOW=
`
        if (extraVars.length > 0) {
            content += `
# ---------------------------------------------------------------
# 🧪 VARIÁVEIS DETECTADAS NO PROJETO
# ---------------------------------------------------------------
${extraVars.map(v => `${v}=`).join('\n')}
`
        }

        fs.writeFileSync(envPath, content, 'utf-8')
        const doc = await vscode.workspace.openTextDocument(envPath)
        await vscode.window.showTextDocument(doc)
        vscode.window.showInformationMessage('🛡️ Sentinel: .env enterprise gerado com sucesso!')
    }
}

