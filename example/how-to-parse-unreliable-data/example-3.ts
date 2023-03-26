import dotenv from 'dotenv'
import * as RF from 'fp-ts/Refinement'
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

// 📝 Create refinement function for every config component
type PortConfig = { port: string }
const refinementPort: RF.Refinement<RawConfig, PortConfig> = (
  raw: RawConfig
): raw is PortConfig => typeof raw.port === 'string'

type DbConfig = { mongoDbConnectString: string }
const refinementDbString: RF.Refinement<RawConfig, DbConfig> = (
  raw: RawConfig
): raw is DbConfig =>
  typeof raw.mongoDbConnectString === 'string'

type EnvDevConfig = { environment: 'dev' }
const refinementDev: RF.Refinement<RawConfig, EnvDevConfig> = (
  raw: RawConfig
): raw is EnvDevConfig => raw.environment === 'dev'

type EnvTestConfig = { environment: 'test' }
const refinementTest: RF.Refinement<
  RawConfig,
  EnvTestConfig
> = (raw: RawConfig): raw is EnvTestConfig =>
  raw.environment === 'test'

type EnvProdConfig = { environment: 'prod' }
const refinementProd: RF.Refinement<
  RawConfig,
  EnvProdConfig
> = (raw: RawConfig): raw is EnvProdConfig =>
  raw.environment === 'prod'

// 📝 Compose dev, test and prod refinement to env refinement
const refinementEnvironment = pipe(
  refinementDev,
  RF.or(refinementTest),
  RF.or(refinementProd)
)
assert.equal(refinementEnvironment(rawConfig), true)
assert.equal(
  refinementEnvironment({ ...rawConfig, environment: 'xxx' }),
  false
)

// 📝 Compose port, db and env refinement to config refinement
const refinementConfig = pipe(
  refinementPort,
  RF.and(refinementDbString),
  RF.and(refinementEnvironment)
)
assert.equal(refinementConfig(rawConfig), true)
assert.equal(
  refinementConfig({ ...rawConfig, port: undefined }),
  false
)

// 🎉 the 'config' inside if scope is Config
if (refinementConfig(rawConfig)) {
  const config: Config = rawConfig
}
