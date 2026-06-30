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

    // Comando refresh
    const refreshCmd = vscode.commands.registerCommand('sentinel.refresh', () => {
        provider.refresh()
        vscode.window.showInformationMessage('🛡️ Sentinel: Escaneando variáveis...')
    })

    // Comando gerar .env
    const generateCmd = vscode.commands.registerCommand('sentinel.generate', async () => {
        const variables = await scanner.scanVariables()
        if (variables.length === 0) {
            vscode.window.showWarningMessage('🛡️ Sentinel: Nenhuma variável encontrada no projeto!')
            return
        }
        await validator.generateEnvFile(variables)
        await provider.refresh()
    })

    // Refresh ao salvar arquivo
    const onSave = vscode.workspace.onDidSaveTextDocument(async (doc) => {
        if (doc.fileName.includes('.env') || doc.fileName.includes('env-config')) {
            await provider.refresh()
        }
    })

    // Refresh inicial
    provider.refresh()

    context.subscriptions.push(refreshCmd, generateCmd, onSave)
}

export function deactivate() {}