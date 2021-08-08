import { series, src, dest } from 'gulp'
import { resolve } from 'path'
import { glob, runTypeChain } from 'typechain'
import execa from 'execa'

export const typechain = async (): Promise<void> => {
    const cwd = __dirname
    const filesToProcess = glob(cwd, ['abis/*.json'])
    await runTypeChain({
        allFiles: filesToProcess,
        cwd,
        filesToProcess,
        outDir: resolve(__dirname, 'src', 'interfaces'),
        target: 'ethers-v5',
    })
}

export const typescript = async (): Promise<void> => {
    await execa('npx', ['tsc', '--build'], { cwd: __dirname, stdio: 'inherit' })
    src(resolve('./src/interfaces/**/*.d.ts')).pipe(dest('./dist/interfaces'))
}

export const prepublish = series(typechain, typescript)
