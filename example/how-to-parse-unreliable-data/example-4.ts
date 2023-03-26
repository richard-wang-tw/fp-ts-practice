import dotenv from 'dotenv'
import * as RF from 'fp-ts/Refinement'
import { pipe } from 'fp-ts/lib/function'
import assert from 'node:assert/strict'
import * as E from 'fp-ts/Either'
dotenv.config()

type RawConfig = Record<string, string | undefined>

const rawConfig: RawConfig = process.env

type Config = {
  port: string
  mongoDbConnectString: string
  environment: 'test' | 'dev' | 'prod'
}

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

const refinementEnvironment = pipe(
  refinementDev,
  RF.or(refinementTest),
  RF.or(refinementProd)
)

const refinementConfig: RF.Refinement<RawConfig, Config> = pipe(
  refinementPort,
  RF.and(refinementDbString),
  RF.and(refinementEnvironment)
)

// 📝 Create a decode function which return either from predicate
const decode = E.fromPredicate(
  refinementConfig,
  () => 'Decode failed' as const
)

// 📝 Case success
const right: E.Either<'Decode failed', Config> =
  decode(rawConfig)

assert.deepEqual(right, {
  _tag: 'Right',
  right: {
    environment: 'dev',
    mongoDbConnectString: 'mongoTest',
    port: '3000',
  },
})

// 📝 Case failed
const left: E.Either<'Decode failed', Config> = decode({
  ...rawConfig,
  port: undefined,
})

assert.deepEqual(left, {
  _tag: 'Left',
  left: 'Decode failed',
})
