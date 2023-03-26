import dotenv from 'dotenv'
import * as t from 'io-ts'
import assert from 'node:assert/strict'
import { PathReporter } from 'io-ts/PathReporter'

dotenv.config()

// 📝 Let's task config as an example
// Suppose our app requires the following config
type Config = {
  port: string
  mongoDbConnectString: string
  environment: 'test' | 'dev' | 'prod'
}

// 📝 How to parse rawConfig to Config ?
type RawConfig = Record<string, string | undefined>
type ParseConfig = (
  rawConfig: RawConfig
) => t.Validation<Config>

// 📝 With the io-ts magic ...
const ConfigCodec = t.strict(
  {
    port: t.string,
    mongoDbConnectString: t.string,
    environment: t.union([
      t.literal('test'),
      t.literal('dev'),
      t.literal('prod'),
    ]),
  },
  'Config'
)
const rawConfig: RawConfig = process.env
const parseConfig: ParseConfig = ConfigCodec.decode

// 📝 We can get config on parse success
assert.deepStrictEqual(parseConfig(rawConfig), {
  _tag: 'Right',
  right: {
    environment: 'dev',
    mongoDbConnectString: 'mongoTest',
    port: '3000',
  },
})

// 📝 Or get error messages on failed
const badRawConfig = {
  ...rawConfig,
  mongoDbConnectString: undefined,
}
assert.deepStrictEqual(
  PathReporter.report(parseConfig(badRawConfig)),
  [
    'Invalid value undefined supplied to : Config/mongoDbConnectString: string',
  ]
)
