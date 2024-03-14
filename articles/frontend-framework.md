---
title: "多すぎるフロントエンドのフレームワークを整理する"
emoji: "🗂️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript", "react", "vue", "nextjs"]
published: false
---

# はじめに

Web サイトを作成する際に、どのフレームワークを採用するか悩んだので、自分なりに整理してみました。
間違っている点があれば、ご指摘いただけると幸いです。

# どんなフレームワークがある？

まずは、フロントエンドのフレームワークにはどのようなものがあるのかを整理してみます。

- **React**
  - **Next.js**
  - **Remix**
  - **Gatsby.js**
- **Vue**
  - **Nuxt.js**
- **Svelte**
  - **SvelteKit**
- **SolidJS**
  - **SolidStart**
- **Qwik**
  - **Qwik City**
- **Astro**

あれこれ記載すると違いが分かりづらくなり比較しづらくなるので、今回はこれらを簡単に比較してみます。

# React

https://ja.legacy.reactjs.org/

- 拡張子は `.jsx` または `.tsx`
- 仮想 DOM を使用する
- 単方向データバインディング

## Next.js

https://nextjs.org/

- ファイルベースのルーティング
- レンダリングは SSR・ISR・SSG に対応
- ビルドは Webpack か Turbopack

## Remix

https://remix.run/

- ファイルベースのルーティング
- レンダリングは SSR に対応
- ビルドは Classic Remix Compiler か Vite

## Gatsby.js

https://www.gatsbyjs.com/

- ファイルベースのルーティング
- レンダリングは SSR・SSG に対応
- Next.js と比較してプラグインが豊富
- BFF は基本的に GraphQL
- ビルドは Webpack

# Vue

https://ja.vuejs.org/

- 拡張子は `.vue`
- 仮想 DOM を使用する
- 双方向データバインディング

## Nuxt.js

https://nuxt.com/

- Vue 版の Next.js といった感じ
- ビルドは webpack か Vite

# Svelte

https://svelte.jp/

- 拡張子は `.svelte`
- Vanilla JS に近い形でコンパイルされる
- 仮想 DOM を使用しないので高速

## SvelteKit

https://kit.svelte.jp/

- Svelte 版の Next.js といった感じ
- ビルドは Vite

# SolidJS

https://www.solidjs.com/

- 拡張子は `.jsx` または `.tsx`なので書き方は React に近い
- Vanilla JS に近い形でコンパイルされる
- 仮想 DOM を使用しないので高速
- 思想としては Svelte に近いが、書き方が React に近いといった違いがある(Svelte と React のいいとこどりなイメージ)

## SolidStart

https://start.solidjs.com/getting-started/what-is-solidstart

- SolidJS 版の Next.js といった感じ
- ビルドは Vinxi(Nitro と Vite がベース)

# Qwik

https://qwik.dev/

- 拡張子は `.jsx` または `.tsx`なので書き方は React に近い
- 初期ロード時に必要なコードのみを送信し、その後必要に応じて追加のコードをロード

## Qwik City

https://qwik.dev/docs/qwikcity/

- Qwik 版の Next.js といった感じ
- ビルドは Vite

# Astro

https://astro.build/

- 拡張子は `.astro`
- React, Vue, Svelte, SolidJS などのコンポーネントを使用可能
- MPA(Multi-page App)のみ
- ビルドは Vite
