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

今回は、フロントエンドにおいてメジャーになっている React と Next.js を基準にして、それ以外のフレームワークを比較してみます。
また、あれこれ記載すると違いが分かりづらくなるので、簡単な比較に留めます。

# React

https://ja.legacy.reactjs.org/

- 拡張子は `.jsx` または `.tsx`
- 仮想 DOM を使用する
- 単方向データバインディング

## Next.js

https://nextjs.org/

- ファイルベースのルーティング
- レンダリングは SSR・CSR・ISR・SSG に対応
- ビルドは Webpack か Turbopack

## Remix

https://remix.run/

- ファイルベースのルーティング
- レンダリングは SSR に対応
- ビルドは Classic Remix Compiler か Vite
- Next.js はデプロイ先を Vercel にしない場合だと制限があったりするので、その点での代替としても使える

## Gatsby.js

https://www.gatsbyjs.com/

- ファイルベースのルーティング
- レンダリングは SSR・SSG・DSG に対応
- BFF は基本的に GraphQL
- ビルドは Webpack
- Next.js と比較してプラグインが豊富

# Vue.js

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
- ビルドは Vite (Vinxi)

# Qwik

https://qwik.dev/

- 拡張子は `.jsx` または `.tsx`なので書き方は React に近い
- 初期ロード時に必要なコードのみを送信し、その後必要に応じて追加のコードをロードするため高速

## Qwik City

https://qwik.dev/docs/qwikcity/

- Qwik 版の Next.js といった感じ
- ビルドは Vite

# Astro

https://astro.build/

- 拡張子は `.astro`
- ファイルベースのルーティング
- レンダリングは SSR・CSR・SSG に対応
- React, Vue, Svelte, SolidJS などのコンポーネントを使用可能
- MPA(Multi-page App)のみ
- ビルドは Vite
- ビルド時に JavaScript を排除するため高速

# まとめ

本当にフロントエンドはフレームワークが多すぎです...！
ただ、それぞれの大まかな特徴については把握できたので、目的に応じて使い分けていきたいです。
