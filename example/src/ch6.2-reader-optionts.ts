import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as OT from 'fp-ts/OptionT'
import * as R from 'fp-ts/Reader'

const rollDice = () => Math.floor(Math.random() * 6) + 1
const isValidBet = (min: number) => (bet: number) => bet > min
const increaseBet = (odds: number) => (bet: number) => bet * odds

// 📝 把賠率、賭資下限、輸贏方式都移動到 dependency 來方便調整
const dependency = {
  odds: 2.5,
  minBet: 100,
  isGamblerWin: () => rollDice() > 4,
}
type Dependency = typeof dependency

// 📝 根據 dependency 生成 play function
const play = (bet: number) => (D: Dependency) =>
  pipe(
    bet,
    O.fromPredicate(isValidBet(D.minBet)),
    O.map(increaseBet(D.odds)),
    O.chain(O.fromPredicate(D.isGamblerWin))
  )

// 📝 用一般的 option 來處理有點麻煩
const optionExample = (dependency: Dependency) =>
  pipe(
    play(100)(dependency),
    O.chain((bet) => play(bet)(dependency)),
    O.chain((bet) => play(bet)(dependency)),
    O.match(
      () => 'You lose',
      (money) => `You win ${money}`
    )
  )

// 📝 用 OptionT 製作一個 ReaderOption Monad !
const RO = {
  chain: OT.chain(R.Monad),
  match: OT.match(R.Monad),
}

const readerOptionExample = pipe(
  play(100),
  RO.chain(play),
  RO.chain(play),
  RO.match(
    () => 'You lose',
    (money) => `You win ${money}`
  )
)

/* ⭐ 課後練習
 *
 * - 如何使用 OptionT ?
 * - 如何使用 ReaderT、EitherT ... 等更多 transformer ?
 */
