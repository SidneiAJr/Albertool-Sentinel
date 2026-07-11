import * as vscode from 'vscode'
import { EnvScanner } from './EnvScanner'
import { EnvValidator } from './EnvValidator'
import { SentinelProvider } from './SidebarProvider'

export function activate(context: vscode.ExtensionContext) {
    console.log('🛡️ Albertool Sentinel ativado!')

    const scanner = new EnvScanner()
    const validator = new EnvValidator()
    const provider = new SentinelProvider(scanner, validator)

    vscode.window.registerTreeDataProvider('sentinel-env', provider)

    const refreshCmd = vscode.commands.registerCommand('sentinel.refresh', () => {
        provider.refresh()
        vscode.window.showInformationMessage('🛡️ Sentinel: Escaneando variáveis...')
    })

    // Enterprise — seções completas
    const generateCmd = vscode.commands.registerCommand('sentinel.generate', async () => {
        const variables = await scanner.scanVariables()
        if (variables.length === 0) {
            vscode.window.showWarningMessage('🛡️ Sentinel: Nenhuma variável encontrada no projeto!')
            return
        }
        await validator.generateEnvFile(variables)
        await provider.refresh()
    })

    // Lite — só o que o scanner detectou
    const generateLiteCmd = vscode.commands.registerCommand('sentinel.generateLite', async () => {
        const variables = await scanner.scanVariables()
        if (variables.length === 0) {
            vscode.window.showWarningMessage('🛡️ Sentinel: Nenhuma variável encontrada no projeto!')
            return
        }
        await validator.generateEnvFileLite(variables)
        await provider.refresh()
    })

    const onSave = vscode.workspace.onDidSaveTextDocument(async (doc) => {
        if (doc.fileName.includes('.env') || doc.fileName.includes('env-config')) {
            await provider.refresh()
        }
    })

    provider.refresh()
    context.subscriptions.push(refreshCmd, generateCmd, generateLiteCmd, onSave)
}

export function deactivate() {}