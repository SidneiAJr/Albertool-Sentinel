import * as vscode from 'vscode'
import { EnvScanner } from './EnvScanner'
import { EnvValidator, EnvStatus } from './EnvValidator'

export class SentinelProvider implements vscode.TreeDataProvider<SentinelItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<SentinelItem | undefined | null | void>()
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event

    private scanner: EnvScanner
    private validator: EnvValidator
    private statuses: EnvStatus[] = []
    private hasEnvFile: boolean = false

    constructor(scanner: EnvScanner, validator: EnvValidator) {
        this.scanner = scanner
        this.validator = validator
    }

    async refresh() {
        const variables = await this.scanner.scanVariables()
        this.statuses = this.validator.validate(variables)
        this.hasEnvFile = this.statuses.length > 0
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: SentinelItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: SentinelItem): SentinelItem[] {
        if (!element) {
            if (this.statuses.length === 0) {
                return [new SentinelItem(
                    '⚠️ Nenhuma variável encontrada',
                    vscode.TreeItemCollapsibleState.None
                )]
            }

            const missing = this.statuses.filter(s => !s.exists)
            const found = this.statuses.filter(s => s.exists)

            const summaryLabel = missing.length === 0
                ? `✅ Todas as variáveis OK (${found.length})`
                : `⚠️ ${missing.length} variável(is) faltando de ${this.statuses.length}`

            const summary = new SentinelItem(
                summaryLabel,
                vscode.TreeItemCollapsibleState.None
            )

            const missingGroup = missing.length > 0
                ? new SentinelItem(
                    `❌ Faltando (${missing.length})`,
                    vscode.TreeItemCollapsibleState.Expanded,
                    'missing-group'
                )
                : null

            const foundGroup = new SentinelItem(
                `✅ Configuradas (${found.length})`,
                vscode.TreeItemCollapsibleState.Collapsed,
                'found-group'
            )

            const items: SentinelItem[] = [summary]
            if (missingGroup) items.push(missingGroup)
            items.push(foundGroup)

            return items
        }

        if (element.contextValue === 'missing-group') {
            return this.statuses
                .filter(s => !s.exists)
                .map(s => {
                    const item = new SentinelItem(
                        `❌ ${s.variable}`,
                        vscode.TreeItemCollapsibleState.None,
                        'var-missing'
                    )
                    item.tooltip = `${s.variable} não encontrada no .env`
                    item.description = 'FALTANDO'
                    return item
                })
        }

        if (element.contextValue === 'found-group') {
            return this.statuses
                .filter(s => s.exists)
                .map(s => {
                    const item = new SentinelItem(
                        `✅ ${s.variable}`,
                        vscode.TreeItemCollapsibleState.None,
                        'var-found'
                    )
                    // Mostra valor mascarado se tiver valor
                    item.description = s.value ? '••••••' : 'vazio'
                    item.tooltip = s.value
                        ? `${s.variable} = ${s.value.substring(0, 3)}••••`
                        : `${s.variable} está vazio`
                    return item
                })
        }

        return []
    }
}

export class SentinelItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue?: string
    ) {
        super(label, collapsibleState)
    }
}