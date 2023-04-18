import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import { Lens, Optional } from 'monocle-ts'

type Name = {
  _tag: 'Name'
  value: string
}

type Age = {
  _tag: 'Age'
  value: number
}

const Name = (value: string): Name => ({ _tag: 'Name', value })

const Age = (value: number): Age => ({ _tag: 'Age', value })

type Person = {
  name: Name
  age: Age
  spouse: O.Option<Person>
  sisters: Person[]
  brothers: Person[]
}

const Mary = {
  name: Name('Mary'),
  age: Age(25),
  spouse: O.none,
  sisters: [],
  brothers: [],
}

const Eric = {
  name: Name('Eric'),
  age: Age(25),
  spouse: O.some(Mary),
  sisters: [],
  brothers: [],
}

const Robert = {
  name: Name('Robert'),
  age: Age(20),
  spouse: O.none,
  sisters: [],
  brothers: [],
}

const James: Person = {
  name: Name('James'),
  age: Age(30),
  spouse: O.none,
  sisters: [],
  brothers: [Eric, Robert],
}

const name = Lens.fromProp<Person>()('name')
const age = Lens.fromProp<Person>()('age')
const spouse = Optional.fromOptionProp<Person>()('spouse')
const sisters = Lens.fromProp<Person>()('sisters')
const brothers = Lens.fromProp<Person>()('brothers')
const eldestBrother = new Optional<Person[], Person>(
  (brothers) => (brothers.length > 0 ? O.some(brothers[0]) : O.none),
  (a) => (b) => [a, ...b]
)

// 📝 對照文件 Optional - constructors - optional
// 請找出在 eldestBrother = new Optional...
// 裡面的 S, A, s, a

const nameValue = Lens.fromProp<Name>()('value')

const wifeNameOfEldestBrother = brothers
  .composeOptional(eldestBrother)
  .compose(spouse)
  .composeLens(name)
  .composeLens(nameValue)

// 📝 請找出文件中的 composeOptional / compose / composeLens 並嘗試說明它們

const result1 = wifeNameOfEldestBrother.getOption(James)
const newJames = wifeNameOfEldestBrother.modify((name) => name + 'yyyyyyyyyyyy')(James)
const result2 = wifeNameOfEldestBrother.getOption(newJames)

console.log(result1)
console.log(result2)

/* ⭐ 課後練習
 *
 * - 如何使用 OptionT ?
 * - 如何使用 ReaderT、EitherT ... 等更多 transformer ?
 */
