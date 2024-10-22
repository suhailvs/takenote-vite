# React + TypeScript + Vite

https://www.youtube.com/watch?v=SqcY0GlETPk

this project is setup using `$ npm create vite@latest`

```
$ git clone https://github.com/mylearnit/takenote-vite
$ cd takenote-vite
$ npm i
$ npm run dev
```

For react 19+ you need to force install

```
$ npm i --legacy-peer-deps react-split-pane
$ npm i --legacy-peer-deps sass-embedded
```

For build there is splitpane bug, to fix check:

https://github.com/tomkp/react-split-pane/issues/830#issue-1361281812


edit:`node_modules/react-split-pane/index.d.ts`
