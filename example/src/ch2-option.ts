import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'

// 📝 Option 就是「可能有、也可能沒有」
const optionSome: O.Option<string> = O.some('hello')
const optionNone: O.Option<string> = O.none

// 📝 可以從 任意型別 | null | undefined 生成 option
const optionFromNullable: O.Option<string> = O.fromNullable('hello' as string | null | undefined)

// 📝 可以從上個章節學到的 predicate 生成
const optionFromPredicate: O.Option<number> = O.fromPredicate((n: number) => n < 10)(5)

// 📝 甚至可以從 Array 生成
const optionNonEmptyArray: O.Option<NEA.NonEmptyArray<number>> = NEA.fromArray([])

// 📝 還可以導入 A -> Nullable<A> 的 function 生成
const nullableFunction = (s: string) => (s.length === 5 ? s : undefined)
const optionFromNullableKSome: O.Option<string> = O.fromNullableK(nullableFunction)('hello')
const optionFromNullableKNone: O.Option<string> = O.fromNullableK(nullableFunction)('hey')

// 🙋 對照文件 Option - lifting - fromPredicate 第三個 signature
// 請找出上面 O.fromPredicate ... 裡面的 a 和 predicate

// 🙋 對照文件 Option - lifting - fromNullableK
// 請找出上面 O.fromNullableK ... 裡面的 f, A, B

// 📝 我們定義一個擲硬幣動作，這個硬幣怪怪的，只有 30 % 機率正面
const tossCoin = () => (Math.random() > 0.7 ? 'head' : 'tail')

// 📝 當我們要連續賭 3 次並取得結果字串時，命令式風格會這樣寫
const imperativeExample = (bet: number) => {
  let money = 0

  if (bet > 0) {
    money = bet
    if ((Math.random() > 0.7 ? 'head' : 'tail') === 'head') {
      money *= 2
      if ((Math.random() > 0.7 ? 'head' : 'tail') === 'head') {
        money *= 2
        if ((Math.random() > 0.7 ? 'head' : 'tail') === 'head') {
          money *= 2
        } else {
          money = 0
        }
      } else {
        money = 0
      }
    } else {
      money = 0
    }
  }

  if (money > 0) {
    return `You win ${money}`
  } else {
    return `You lose`
  }
}

// 📝 用宣告式的方法來做做看

const isValidBet = (bet: number) => bet > 0
const increaseBet = (bet: number) => bet * 2
const winOrLose = O.fromPredicate(() => tossCoin() === 'head')

const play = flow(O.fromPredicate(isValidBet), O.map(increaseBet), O.chain(winOrLose))

const declarativeExample = flow(
  play,
  O.chain(play),
  O.chain(play),
  O.match(
    () => 'You lose',
    (money) => `You win ${money}`
  )
)

// 🙋 對照文件 Option - mapping - map
// 請找出在 O.map((bet) => bet * 2) 裡面的 f, fa, A, B

// 🙋 對照文件 Option - sequencing - chain
// 請找出在 O.chain(playV2) 裡面的 f, ma, A, B

// 🙋 對照文件 Option - pattern matching - match
// 請找出在 O.match ...  裡面的 A, B, onNone, onSome, ma

console.log('imperativeExample', imperativeExample(100))
console.log('declarativeExample', declarativeExample(100))

// 📝 上面的作法其實還有改善的空間! 改善的方法將會寫在 reader option 章節

// 📝 如果賭輸了還想繼續賭怎麼辦呢 ?
const play2MoreTimes = (bet: number) =>
  pipe(
    play(bet),
    O.alt(() => play(bet)),
    O.alt(() => play(bet))
  )

// 🙋 對照文件 Option - pattern matching - match
// 請找出在 O.alt ...  裡面的 that, fa, A

console.log('play2MoreTimes', play2MoreTimes(100))

/* ⭐ 課後練習
 *
 * - 甚麼時候使用 Option ?
 * - fromNullable 和 fromNullableK 有甚麼差別 ?
 * - 如何使用 option 的 map / chain / match / alt ?
 */
