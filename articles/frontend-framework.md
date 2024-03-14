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
- 独自の API を用意せず、Web 標準の API を採用
- Next.js はデプロイ先を Vercel にしない場合だと制限があったりするので、その点での代替としても使える

"**Get good at Remix, get good at the web.**"

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

# ランキング

## JavaScript Rising Stars(2023)

まずは 2023 年の[JavaScript Rising Stars](https://risingstars.js.org/2023/en)で今回比較したフレームワークのランキングを見てみます。

### Front-end Frameworks

- 1 位: **React**
- 3 位: **Svelte**
- 5 位: **Vue.js**
- 7 位: **SolidJS**
- 8 位: **Qwik**

### Back-end/Full-stack

- 1 位: **Next.js**
- 2 位: **Astro**
- 6 位: **Nuxt.js**
- 9 位: **Qwik**
- 11 位: **Remix**
- 12 位: **SvelteKit**

### Static Sites

- 1 位: **Next.js**
- 2 位: **Astro**
- 4 位: **Nuxt.js**

このような結果でした。本記事では記載しておりませんが、**Front-end Frameworks**の 2 位にランクインしている htmx にも注目ですね。

## State of JS(2022)

次は、2022 年の[State of JS](https://2022.stateofjs.com/)を見てみます。(2023 年の結果は Comming Soon です。)

### Awareness

認知度

- 1 位: **React**
- 1 位: **Vue.js**
- 4 位: **Svelt**
- 7 位: **SolidJ**
- 9 位: **Qwik**

### Usage

使用率

- 1 位: **React**
- 3 位: **Vue.js**
- 4 位: **Svelte**
- 7 位: **SolidJS**
- 11 位: **Qwik**

### Satisfaction

満足度

- 1 位: **Svelte**
- 2 位: **Qwik**
- 3 位: **SolidJS**
- 4 位: **Vue.js**
- 5 位: **React**

### Retention

継続利用率

- 1 位: **SolidJS**
- 2 位: **Svelte**
- 3 位: **Qwik**
- 4 位: **React**
- 5 位: **Vue.js**

### Positive

「学習したい」「また使用したい」

- 1 位: **React**
- 2 位: **Svelte**
- 3 位: **Vue.js**
- 4 位: **SolidJS**
- 5 位: **Qwik**

### Negative

「学習したくない」「もう使用したくない」

- 7 位: **Vue.js**
- 8 位: **SolidJS**
- 9 位: **Qwik**
- 10 位: **Svelte**
- 11 位: **React**

### Other Tools

- 1 位: **Astro**
- 2 位: **Remix**
- 3 位: **Next.js**
- 6 位: **Nuxt.js**
- 9 位: **SvelteKit**

認知では React と Vue のツートップですが、Svelte, SolidJS, Qwik が満足度や継続利用率で上位にランクインしているのが興味深いですね。
また、**JavaScript Rising Stars**では Astro は Next.js に次ぐ 2 位でしたが、**State of JS**では Astro は 1 位となってますね。

# まとめ

本当にフロントエンドはフレームワークが多すぎです...！
ただ、それぞれの大まかな特徴については把握できたので、目的に応じて使い分けていきたいです。
