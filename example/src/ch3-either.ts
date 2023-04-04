import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'

const cutFailed = () => Math.random() < 0.2

type CutFruitError = 'cut orange error' | 'cut grape error'

// 📝 Either 就是「有可能正常，也可能壞掉」

// 📝 切葡萄，有可能切壞，我們先用熟悉的 predicate 找出壞掉的部分
const cutGrape = (grape: 'grape') =>
  pipe(
    'grape',
    E.fromPredicate(cutFailed, (): CutFruitError => 'cut grape error'),
    E.map(() => 'cut grape' as const)
  )
// 🙋 對照文件 Either - lifting - fromPredicate 第三個
// 請找出在 E.fromPredicate ...  裡面的 A, E, B, predicate, onFalse

// 📝 切橘子，也有可能壞掉直接拋錯誤，這時候就要用 tryCatch
const cutOrange = (orange: 'orange') =>
  E.tryCatch(
    () => {
      if (cutFailed()) {
        throw 'cut orange error'
      }
      return 'cut orange' as const
    },
    (): CutFruitError => 'cut orange error'
  )
// 🙋 對照文件 Either - interop - tryCatch
// 請找出在 E.tryCatch ...  裡面的 A, E, f, onThrow

const getPlate = (cabinet: 'cabinet') => 'plate' as const

// 📝 切完橘子葡萄，開始裝盤
const getFruitTray = pipe(
  E.of((grape: 'cut grape') => (orange: 'cut orange') => (plate: 'plate') => ({
    grape,
    orange,
    plate,
  })),
  E.ap(cutGrape('grape')),
  E.ap(cutOrange('orange')),
  E.flap(getPlate('cabinet')),
  E.mapLeft((error) => 'Sorry for ' + error + ' (⋟﹏⋞)')
)
// 🙋 對照文件 Either - utils - ap
// 請找出在 E.ap(cutGrape('grape')) 裡面的 A, E, B, fa, fab, a

// 🙋 對照文件 Either - mapping - flap
// 請找出在 E.ap(cutGrape('grape')) 裡面的 A, E, B, a, fab

// 🙋 對照文件 Either - error handling - mapLeft
// 請找出在 E.mapLeft... 裡面的 E, G, f, fa

/* ⭐ 課後複習
 *
 * - 甚麼時後使用 Either ?
 * - either 的 fromNullableK / fromOptionK 如何使用 ?
 * - either 如何使用 ap / flap / orElse / mapLeft ?
 * - option 如何使用 ap / flap ?
 * - either 如何使用 map / chain / match / alt  ?
 */
