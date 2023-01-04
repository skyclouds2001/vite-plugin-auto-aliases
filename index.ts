/* eslint-disable */
import type { Plugin, AliasOptions } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const addAlias = (aliases: AliasOptions, alias: string, path: string): void => {
  if (!aliases.hasOwnProperty(alias)) {
    Object.defineProperty(aliases, alias, {
      value: path,
    })
  }
}

const generateAlias = (alias: AliasOptions, {
  enable = true,
  root = process.cwd(),
  prefix = '@',
}: PluginConfig): AliasOptions => {
  try {
    const src = path.resolve(root, './src/')
    addAlias(alias, prefix, src)

    if (enable) {
      const fds = fs.readdirSync(src)
      fds.forEach(v => {
        const fss = path.resolve(src, v)
        const fstat = fs.statSync(fss)
        if (fstat.isDirectory()) {
          addAlias(alias, prefix + v, fss)
        }
      })
    }
  } catch (err) {
    console.error(err)
  }
  return alias
}

interface PluginConfig {
  enable?: boolean
  root?: string
  prefix?: string
}

export default function (pluginConfig: PluginConfig = {}): Plugin {
  return {
    name: 'vite-plugin-auto-aliases',
    config: config => ({
      resolve: {
        alias: generateAlias(config.resolve?.alias ?? {}, pluginConfig),
      }
    }),
  }
}
