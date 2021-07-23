import { resolve } from 'path'
import execa from 'execa'
import { dest, series, src } from 'gulp'
import { glob, runTypeChain } from 'typechain'

export const typechain = async () => {
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

export const typescript = async () => {
    await execa('npx', ['tsc', '--build'], { cwd: __dirname, stdio: 'inherit' })
    return src(resolve('./src/interfaces/**/*.d.ts')).pipe(dest('./dist/interfaces'))
}

export const build = series(typechain, typescript)
