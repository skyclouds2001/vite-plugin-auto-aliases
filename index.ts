/* eslint-disable */
import type { Plugin, AliasOptions } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const generateAlias = (alias: AliasOptions, {
  enable = true,
  root = __dirname,
  prefix = '@',
}: PluginConfig): AliasOptions => {
  try {
    const src = path.resolve(root, './src/')
    Object.defineProperty(alias, '@', {
      value: src,
    })

    if (enable) {
      const fds = fs.readdirSync(src)
      fds.forEach(v => {
        const fss = path.resolve(src, v)
        try {
          const fstat = fs.statSync(fss)
          if (fstat.isDirectory()) {
            Object.defineProperty(alias, prefix + v, {
              value: fss,
            })
          }
        } catch (err) {
          console.error(err)
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
    enforce: 'pre',
    config: config => ({
      resolve: {
        alias: generateAlias(config.resolve?.alias ?? {}, pluginConfig),
      }
    }),
  }
}
