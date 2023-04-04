import { pipe } from 'fp-ts/lib/function'
import { ap } from 'fp-ts/lib/Identity'
import * as R from 'fp-ts/Reader'

// 📝 定義廚房有鍋子、油、高麗菜
type Kitchen = {
  cabinet: {
    pot: 'pot'
    oil: 'oil'
  }
  refrigerator: {
    cabbage: 'cabbage'
  }
}

// 📝 從廚房櫃子裡取出鍋子
const getPot = (kitchen: Kitchen) => kitchen.cabinet.pot

// 🙋 對照文件 reader - model - reader (interface)
// 請找出在 getPot 裡面的 R、A

// 📝 把鍋燒熱，加入寬油
const getOilPot = (pot: 'pot') => (kitchen: Kitchen) => {
  const process = pot + kitchen.cabinet.oil
  return 'oil pot' as const
}

// 🙋 對照文件 Reader - model - Reader (interface)
// 請找出在 getOilPot 裡面的 R、A

// 📝 開始炒菜，把「油鍋+高麗菜」變成「炒高麗菜」
const getFriedCabbage = (oilPot: 'oil pot') => (kitchen: Kitchen) => {
  const process = oilPot + kitchen.refrigerator.cabbage
  return 'fried cabbage' as const
}

// 📝 把上面的步驟串起來，這就是具有 Reader 精神的 function 了
// 我們從「廚房」這個環境中，取得了「炒高麗菜」這個輸出
const friedCabbageV1 = (kitchen: Kitchen) =>
  pipe(
    getPot(kitchen),
    (oil) => getOilPot(oil)(kitchen),
    (oilPot) => getFriedCabbage(oilPot)(kitchen)
  )

// 📝 使用 Reader 語法整理
const friedCabbageV2 = pipe(getPot, R.chain(getOilPot), R.chain(getFriedCabbage))

// 🙋 對照文件 reader - sequencing - chain
// 請找出在 R.chain(getOilPot) 裡面的  A、R、B、f、ma

const kitchen: Kitchen = {
  cabinet: {
    pot: 'pot',
    oil: 'oil',
  },
  refrigerator: {
    cabbage: 'cabbage',
  },
}

console.log('fried cabbage:', friedCabbageV2(kitchen))

const getOil = (kitchen: Kitchen) => kitchen.cabinet.oil

const getCabbage = (kitchen: Kitchen) => kitchen.refrigerator.cabbage

// 📝 有時候我們只想簡單做個沙拉，不需要煎煮炒炸
const getSalad = (oil: 'oil') => (pot: 'pot') => (cabbage: 'cabbage') => ({
  oil,
  pot,
  cabbage,
})

// 📝 同樣可以使用 Reader 語法
const cabbageSaladV1 = (kitchen: Kitchen) =>
  pipe(getSalad, ap(getOil(kitchen)), ap(getPot(kitchen)), ap(getCabbage(kitchen)))

const cabbageSaladV2 = pipe(R.of(getSalad), R.ap(getOil), R.ap(getPot), R.ap(getCabbage))

console.log('cabbage salad:', cabbageSaladV2(kitchen))

// 🙋 對照文件 reader - utils - ap
// 請找出在 R.ap(getOil) 裡面的 R、A、B、fa、fab

// 🙋 以寫 Web 應用程式的角度來看，廚房是甚麼 ?
// getSalad、getCabbage 甚至 friedCabbageV2 可能是甚麼 ?

/* ⭐ 課後練習
 *
 * - 甚麼時候使用 Reader ?
 * - 如何使用 Reader 的 ap / map / chain ?
 * - 以寫 Web 應用程式的角度來看，廚房是甚麼 ?
 * - 如何使用 reader task either ?
 */
