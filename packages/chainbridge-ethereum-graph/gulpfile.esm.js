import { generate } from '@graphql-codegen/cli'
import execa from 'execa'
import { series } from 'gulp'
import { resolve } from 'path'

export const codegen = async () => {
    await generate({
        generates: {
            './src/interfaces/graph.ts': {
                documents: resolve(__dirname, 'documents.graphql'),
                schema: resolve(__dirname, 'schema.graphql'),
                config: {
                    scalars: {
                        BigInt: 'string',
                        Bytes: 'string',
                    },
                    strictScalars: true,
                },
                plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
            },
        },
    })
}

export const typescript = async () => {
    await execa('npx', ['tsc', '--build'], { cwd: __dirname, stdio: 'inherit' })
}

export const build = series(codegen, typescript)
