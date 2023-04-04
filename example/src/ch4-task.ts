import { flow, pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/Task'
import * as A from 'fp-ts/Array'
import * as AP from 'fp-ts/Apply'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 🙋 大家有玩過 Overcooked 嗎? 想想以下動作的依賴關係
const takeTomato = (cabinet: 'cabinet') => delay(100).then(() => 'tomato' as const) //拿番茄
const takeLettuce = (cabinet: 'cabinet') => delay(100).then(() => 'lettuce' as const) // 拿生菜
const cutTomato = (tomato: 'tomato') => delay(500).then(() => 'cut tomato' as const) // 切番茄
const cutLettuce = (lettuce: 'lettuce') => delay(500).then(() => 'cut lettuce' as const) // 切生菜
const takePlate = (cabinet: 'cabinet') => delay(150).then(() => 'plate' as const) // 拿盤子
const arrange = (cutTomato: 'cut tomato', cutLettuce: 'cut lettuce', plate: 'plate') =>
  delay(500).then(() => 'salad' as const) // 擺盤

// 📝 如果依序做，很沒有效率對吧?
const makeSalad = async (cabinet: 'cabinet') => {
  const tomato = await takeTomato(cabinet)
  const lettuce = await takeLettuce(cabinet)
  const _cutTomato = await cutTomato(tomato)
  const _cutLettuce = await cutLettuce(lettuce)
  const plate = await takePlate(cabinet)
  return await arrange(_cutTomato, _cutLettuce, plate)
}

// 📝 我們先把上面的程式整理成 Task
const takeTomatoTask = (cabinet: 'cabinet') => () => delay(100).then(() => 'tomato' as const) //拿番茄
const takeLettuceTask = (cabinet: 'cabinet') => () => delay(100).then(() => 'lettuce' as const) // 拿生菜
const cutTomatoTask = (tomato: 'tomato') => () => delay(500).then(() => 'cut tomato' as const) // 切番茄
const cutLettuceTask = (lettuce: 'lettuce') => () => delay(500).then(() => 'cut lettuce' as const) // 切生菜
const takePlateTask = (cabinet: 'cabinet') => () => delay(150).then(() => 'plate' as const) // 拿盤子
const arrangeTask =
  (material: { cutTomato: 'cut tomato'; cutLettuce: 'cut lettuce'; plate: 'plate' }) => () =>
    delay(500).then(() => 'salad' as const) // 擺盤

const getCutTomatoTask = flow(takeTomatoTask, T.chain(cutTomatoTask))
const getCutLettuceTask = flow(takeLettuceTask, T.chain(cutLettuceTask))

// 📝 同時做能平行處理的三個任務
const getMaterialTask = (cabinet: 'cabinet') =>
  AP.sequenceS(T.ApplyPar)({
    cutTomato: getCutTomatoTask(cabinet),
    cutLettuce: getCutLettuceTask(cabinet),
    plate: takePlateTask(cabinet),
  })

// 📝 最後進行擺盤
const makeSaladTask = (cabinet: 'cabinet') => pipe(getMaterialTask(cabinet), T.chain(arrangeTask))

// 🙋 比對文件 Task，請找出 cutTomatoTask 裡面的 A

// 🙋 比對文件 Task - chain
// 請找出 getCutTomatoTask 裡面的 A、B、a、m

// 😈 對照文件 Apply sequenceS sequenceS<F extends URIS>
// 請找出在 AP.sequenceS(T.ApplyPar) ...
// 裡面的 F, r, NER, K, A

// 📝 假設我們要同時做十個沙拉，我們可以這樣做
const make10SaladPar = pipe(
  A.makeBy(10, () => 'cabinet' as const),
  A.traverse(T.ApplicativePar)(makeSaladTask)
)

// 😈 對照文件 Traversable PipeableTraverse1  <F extends URIS>
// 請找出在 A.traverse(T.ApplicativePar)(makeSaladTask)
// 裡面的 A, B, F, f, T, ta

const runTasks = async () => {
  const t1 = Date.now()
  const salad1 = await makeSalad('cabinet')
  const t2 = Date.now()
  console.log(`makeSalad, execution time: ${t2 - t1} ms`, [salad1])

  const salad2 = await makeSaladTask('cabinet')()
  const t3 = Date.now()
  console.log(`makeSaladTask, execution time: ${t3 - t2} ms`, [salad2])
  const salad10 = await make10SaladPar()
  const t4 = Date.now()
  console.log(`make10SaladPar , execution time: ${t4 - t3} ms`, salad10)
}

runTasks()

/* ⭐ 課後複習
 *
 * - 甚麼時後使用 task ?
 * - 如何使用 task 的 map / chain ?
 * - 如何使用 task 的 sequenceS / traverse ?
 * - 如何使用 task 的 sequenceT ?
 * - 如何使用 task 的 ap / flap ?
 * - 如何使用 option 或 either 的 sequenceS / sequenceT / traverse ?
 * - 如何使用 task either ?
 */
