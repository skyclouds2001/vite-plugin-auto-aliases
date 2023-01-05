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
  dir = 'src',
  prefix = '@',
  log = true,
  logPath = path.resolve(process.cwd(), 'logs'),
  logFile = 'vite-plugin-auto-aliases.log',
}: PluginConfig): AliasOptions => {
  try {
    const src = path.resolve(root, dir)
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
    console.error('[ERROR] VITE_PLUGIN_AUTO_ALIASES: ', err)
    try {
      if (log) {
        const error = err as Error
        fs.writeFileSync(path.resolve(logPath, logFile), error.name + ' : ' + error.message)
      }
    } catch {}
  }
  return alias
}

interface PluginConfig {
  enable?: boolean
  root?: string
  dir?: string
  prefix?: string
  log?: boolean
  logPath?: string
  logFile?: string
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
