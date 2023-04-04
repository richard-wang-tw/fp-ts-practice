import { pipe } from 'fp-ts/lib/function'
import * as P from 'fp-ts/Predicate'

// 📝 閏年
// 公元年分為4的倍數但非100的倍數，為閏年。
// 公元年分為400的倍數為閏年。

const isMultipleOf4 = (n: number) => n % 4 === 0

// 📝 上面這樣其實就是一個 predicate function
// 不過太繁瑣了，我們建立一個通用版本

const isMultipleOf = (n1: number) => (n2: number) => n2 % n1 === 0

// 🙋 對照文件 predicate - utils - Predicate (interface)
// 請找出 A 與 Predicate<A>

// 📝 把 predicate 組合起來完成閏年定義

const isLeapYearV1 = pipe(isMultipleOf(4), P.and(P.not(isMultipleOf(100))), P.or(isMultipleOf(400)))

// 🙋 對照文件 predicate - utils - or
// 請找出在 P.or(isMultipleOf(400)) 裡面的 A、second、first

console.log('isLeapYearV1 2023', isLeapYearV1(2023))
console.log('isLeapYearV1 2024', isLeapYearV1(2024))

// 🙋 不管是 V1 或 V2 都符合 predicate 的「形狀」
// 那 兩者有哪些差別呢 ?

const isLeapYearV2 = (n: number) => (n % 4 === 0 && !(n % 100 === 0)) || n % 400 === 0

// 📝 藉由 contramap 判斷日期是不是閏年

const getYear = (date: Date) => date.getFullYear()

const isLeapYearDate = pipe(isLeapYearV1, P.contramap(getYear))

// 🙋 對照文件 predicate - utils - contramap
//  請找出在 P.contramap(getYear) 裡面的 A、B、f、predicate

console.log(
  'isLeapYearDate 2023-03-27T17:46:50.908Z',
  isLeapYearDate(new Date('2023-03-27T17:46:50.908Z'))
)
console.log(
  'isLeapYearDate 2024-03-27T17:46:50.908Z',
  isLeapYearDate(new Date('2024-03-27T17:46:50.908Z'))
)

/* ⭐ 課後練習
 *
 * - 甚麼時候使用 Predicate ?
 * - 如何使用 and / or / not 來組合 predicate ?
 * - 如何使用 contramap ?
 */
