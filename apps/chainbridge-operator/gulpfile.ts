import { mkdir, writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { config as configureDotEnv } from 'dotenv'
import execa from 'execa'
import { series } from 'gulp'

const DEFAULT_NETWORK_ENDPOINT = 'wss://pc-test.phala.network/khala/ws'
const DEFAULT_NETWORK_TYPEDEFS = 'khalaDev'

configureDotEnv()

const endpoint = process.env['NETWORK_ENDPOINT'] ?? DEFAULT_NETWORK_ENDPOINT
const typedefsRef = process.env['NETWORK_TYPEDEFS'] ?? DEFAULT_NETWORK_TYPEDEFS

export const typegenConfigure = async (): Promise<void> => {
    console.info('Using typedefs name:', typedefsRef)

    const dir = resolve(__dirname, 'libs', 'polkadot', 'interfaces', 'phala')
    const file = resolve(dir, 'definitions.ts')

    await mkdir(dir, { recursive: true })

    const definitions = `
        import { ${typedefsRef} } from '@phala/typedefs'
        export default {
            types: ${typedefsRef}
        }
    `

    await writeFile(file, definitions)
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
            './libs/polkadot/interfaces',
        ],
        {
            stdio: 'inherit',
        }
    )
}

export const typegenFromMetadata = async (): Promise<void> => {
    console.info('Using endpoint:', endpoint)

    await execa(
        'ts-node',
        [
            '--skip-project',
            resolve(dirname(require.resolve('@polkadot/typegen')), 'scripts', 'polkadot-types-from-chain.cjs'),
            '--package',
            '.',
            '--output',
            './libs/polkadot/interfaces',
            '--endpoint',
            endpoint,
        ],
        {
            stdio: 'inherit',
        }
    )
}

export const typegen = series(typegenConfigure, typegenFromDefinitions, typegenFromMetadata)
