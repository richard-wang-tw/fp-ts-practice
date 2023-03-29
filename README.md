# Quick start

## How to show slides ?

```cmd
cd slides
npm i
npx reveal-md .\src\index.md --highlight-theme stackoverflow-light
```

## How to build slides ?

```cmd
cd slides
npx reveal-md .\src\index.md --highlight-theme stackoverflow-light --static static
```

## How to run example ?

```cmd
cd example
npm i
npx ts-node .\src\<example>.ts
```

If all assertions are passed, there will be no output after the execution
