/* eslint-disable */
import { Plugin, AliasOptions } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const generateAlias = (alias: AliasOptions, plugin: PluginConfig): AliasOptions => {
  try {
    const root = path.resolve(__dirname, './src/')
    const fds = fs.readdirSync(root)
    fds.forEach(v => {
      const fss = path.resolve(root, v)
      try {
        const fstat = fs.statSync(fss)
        if (fstat.isDirectory()) {
          Object.defineProperty(alias, `@${v}`, {
            value: fss,
            enumerable: true,
            configurable: true,
            writable: true,
          })
        }
      } catch (err) {
        console.error(err)
      }
    })
  } catch (e) {
    console.error(e)
  }
  return alias
}

interface PluginConfig {
  disable?: boolean
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
