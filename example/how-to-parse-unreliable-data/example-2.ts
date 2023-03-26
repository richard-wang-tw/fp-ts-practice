import dotenv from 'dotenv'
import * as P from 'fp-ts/Predicate'
import { pipe } from 'fp-ts/lib/function'
import assert from 'node:assert/strict'

dotenv.config()

type RawConfig = Record<string, string | undefined>

const rawConfig: RawConfig = process.env

type Config = {
  port: string
  mongoDbConnectString: string
  environment: 'test' | 'dev' | 'prod'
}

// 📝 Create predicate function for every config component
const predicatePort: P.Predicate<RawConfig> = (raw) =>
  typeof raw.port === 'string'

const predicateDbString: P.Predicate<RawConfig> = (raw) =>
  typeof raw.mongoDbConnectString === 'string'

const predicateDev: P.Predicate<RawConfig> = (raw) =>
  raw.environment === 'dev'

const predicateTest: P.Predicate<RawConfig> = (raw) =>
  raw.environment === 'test'

const predicateProd: P.Predicate<RawConfig> = (raw) =>
  raw.environment === 'prod'

// 📝 Compose dev, test and prod predicate to env predicate
const predicateEnvironment = pipe(
  predicateDev,
  P.or(predicateTest),
  P.or(predicateProd)
)
assert.equal(predicateEnvironment(rawConfig), true)
assert.equal(
  predicateEnvironment({ ...rawConfig, environment: 'xxx' }),
  false
)

// 📝 Compose port, db and env predicate to config predicate
const predicateConfig = pipe(
  predicatePort,
  P.and(predicateDbString),
  P.and(predicateEnvironment)
)
assert.equal(predicateConfig(rawConfig), true)
assert.equal(
  predicateConfig({ ...rawConfig, port: undefined }),
  false
)

// 😢 the 'config' inside if scope is RawConfig
// not Config
if (predicateConfig(rawConfig)) {
  const config = rawConfig
}
