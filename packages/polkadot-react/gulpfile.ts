import { writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import execa from 'execa'
import { series } from 'gulp'

const DEFAULT_NETWORK_ENDPOINT = 'wss://pc-test.phala.network/khala/ws'
const DEFAULT_NETWORK_TYPEDEFS = 'khalaDev'

const endpoint = process.env['NETWORK_ENDPOINT'] ?? DEFAULT_NETWORK_ENDPOINT
const typedefsRef = process.env['NETWORK_TYPEDEFS'] ?? DEFAULT_NETWORK_TYPEDEFS

export const typegenConfigure = async (): Promise<void> => {
    const definitions = `
        import { ${typedefsRef} } from '@phala/typedefs'
        export default {
            types: ${typedefsRef}
        }
    `

    await writeFile(resolve(__dirname, 'src', 'interfaces', 'phala', 'definitions.ts'), definitions)
}

export const typegenFromDefinitions = async (): Promise<void> => {
    await execa(
        'ts-node',
        [
            '--skip-project',
            resolve(dirname(require.resolve('@polkadot/typegen')), 'scripts', 'polkadot-types-from-defs.cjs'),
            '--package',
            '.',
            '--input',
            './src/interfaces',
        ],
        {
            stdio: 'inherit',
        }
    )
}

export const typegenFromMetadata = async (): Promise<void> => {
    await execa(
        'ts-node',
        [
            '--skip-project',
            resolve(dirname(require.resolve('@polkadot/typegen')), 'scripts', 'polkadot-types-from-chain.cjs'),
            '--package',
            '.',
            '--output',
            './src/interfaces',
            '--endpoint',
            endpoint,
        ],
        {
            stdio: 'inherit',
        }
    )
}

export const typegen = series(typegenConfigure, typegenFromDefinitions, typegenFromMetadata)

export const typescript = async (): Promise<void> => {
    await execa('npx', ['tsc', '--build'])
}

export const prepublish = series(typegen, typescript)
