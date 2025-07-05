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

# フロントエンドのフレームワークの比較

## React

https://ja.legacy.reactjs.org/

- 拡張子は `.jsx` または `.tsx`
- 仮想 DOM を使用する
- 単方向データバインディング

ドキュメントの「[Start a New React Project](https://react.dev/learn/start-a-new-react-project)」には下記の記載があります。

> If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.

"_React で新しいアプリケーションや新しいウェブサイトを完全に構築したい場合は、コミュニティで人気のある React ベースのフレームワークのいずれかを選ぶことをお勧めします。_"

ここでは**Next.js**・**Remix**・**Gatsby**の 3 つが紹介されています。

## Vue.js

https://ja.vuejs.org/

- 拡張子は `.vue`
- 仮想 DOM を使用する
- 双方向データバインディング

## Svelte

https://svelte.jp/

- 拡張子は `.svelte`で、記法は Vue.js に近い
- コンパイル時に変更される可能性がある変数などをすべて Vanilla.js に落とし込み、仮想 DOM を使用しないため高速
- 双方向データバインディング
- 記述量が少ない

ドキュメントの「[Start a new project](https://svelte.dev/docs/introduction#start-a-new-project)」には下記の記載があります。

> We recommend using **SvelteKit**, the official application framework from the Svelte team

"_Svelte チームによるオフィシャルなアプリケーションフレームワークである **SvelteKit** をお使いいただくことをおすすめします_"

## SolidJS

https://www.solidjs.com/

- 拡張子は `.jsx` または `.tsx`なので記法は React に近い
- コンパイル時に変更される可能性がある変数などをすべて Vanilla.js に落とし込み、仮想 DOM を使用しないため高速
- 単方向データバインディング
- 思想としては Svelte に近いものの、速さでは SolidJS の方が、記述量では Svelte の方がそれぞれ優れている

## Qwik

https://qwik.dev/

- 拡張子は `.jsx` または `.tsx`なので記法は React に近い
- JavaScript の実行をできるだけ遅らせることで、初期ロード時が高速
- 単方向データバインディング

他のフレームワーク同様、メタフレームワーク(ここでは **Qwik City**)の使用が推奨されています。

## 表での比較

|                      | React      | Vue.js   | Svelte                       | SolidJS                      | Qwik                                  |
| -------------------- | ---------- | -------- | ---------------------------- | ---------------------------- | ------------------------------------- |
| 拡張子               | .jsx, .tsx | .vue     | .svelte                      | .jsx, .tsx                   | .jsx, .tsx                            |
| ブラウザへの描画     | 仮想 DOM   | 仮想 DOM | コンパイル時に Vanilla.js 化 | コンパイル時に Vanilla.js 化 | JavaScript の実行をできるだけ遅らせる |
| データバインディング | 単方向     | 双方向   | 双方向                       | 単方向                       | 単方向                                |

# 上記をベースにしたメタフレームワークの比較

## Next.js (React ベース)

https://nextjs.org/

- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR・CSR・ISR・SSG に対応
- ビルドは Turbopack を使用

## Remix (React ベース)

https://remix.run/

- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR に対応
- ビルドは Classic Remix Compiler か Vite
- Web 標準に基づいた API
- Next.js はデプロイ先を Vercel にしない場合だと制限があったりするので、その点での代替としても使える

"**Get good at Remix, get good at the web.**"

## Gatsby (React ベース)

https://www.gatsbyjs.com/

- ファイルベースのルーティング
- 画像の最適化
- レンダリングは SSR・SSG・DSG に対応
- ビルドは Webpack
- BFF は基本的に GraphQL を使用する
- Next.js と比較してプラグインが豊富

## Nuxt.js (Vue.js ベース)

https://nuxt.com/

- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR・CSR・ISR・SSG に対応
- ビルドは Vite を使用

## SvelteKit (Svelte ベース)

https://kit.svelte.jp/

- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR・CSR・ISR・SSG に対応
- ビルドは Vite を使用

## SolidStart (SolidJS ベース)

https://start.solidjs.com/getting-started/what-is-solidstart

- ベータ版のため情報が少ない
- MPA に対応
- ファイルシステムベースのルーティング
- レンダリングは SSR・CSR・SSG に対応
- ビルドは Vite (Vinxi)

## Qwik City (Qwik ベース)

https://qwik.dev/docs/qwikcity/

- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR・CSR・SSG に対応
- ビルドは Vite を使用

## Astro

https://astro.build/

- 拡張子は `.astro`
- ファイルシステムベースのルーティング
- 画像の最適化
- レンダリングは SSR・CSR・ISR・SSG に対応
- React, Vue, Svelte, SolidJS などのコンポーネントを使用可能
- ビルドは Vite
- コンテンツ重視のため、 SPA ではなく MPA
- ビルド時にできるだけ JavaScript を排除して高速化

## 表での比較

すでに紹介したフレームワークの特徴も内包しています。

|                                      | Next.js         | Remix                     | Gatsby.js               | Nuxt.js         | SvelteKit                                    | SolidStart  | Qwik City                                  | Astro                               |
| ------------------------------------ | --------------- | ------------------------- | ----------------------- | --------------- | -------------------------------------------- | ----------- | ------------------------------------------ | ----------------------------------- |
| 拡張子                               | .jsx,.tsx       | .jsx,.tsx                 | .vue                    | .svelte         | .jsx,.tsx                                    | .jsx,.tsx   | .astro                                     |
| コンポーネント                       | React           | React                     | React                   | Vue.js          | Svelte                                       | SolidJS     | Qwik                                       | React,Vue,Svelte,SolidJS,etc.       |
| ページング                           | SPA,MPA         | SPA,MPA                   | SPA,MPA                 | SPA,MPA         | SPA,MPA                                      |
| ファイルシステムベースのルーティング | ○               | ○                         | ○                       | ○               | ○                                            | ○           | ○                                          | ○                                   |
| 画像の最適化                         | ○               | ○                         | ○                       | ○               | ○                                            |             | ○                                          | ○                                   |
| レンダリング                         | SSR,CSR,ISR,SSG | SSR                       | SSR,CSR,SSG             | SSR,CSR,ISR,SSG | SSR,CSR,ISR,SSG                              | SSR,CSR,SSG | SSR,CSR,SSG                                | SSR,CSR,ISR,SSG                     |
| ビルド                               | Turbopack       | ClassicRemixCompiler,Vite | Webpack                 | Vite            | Vite                                         | Vite(Vinxi) | Vite                                       | Vite                                |
| その他特徴                           |                 | Web 標準に基づいた API    | BFF には GraphQL を使用 |                 | Svelte を使用する際は SvelteKit の利用が推奨 |             | Qwik を使用する際は Qwik City の利用が推奨 | JavaScript 出来るだけを排除した MPA |

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

<!-- textlint-disable spellcheck-tech-word ja-technical-writing/ja-no-mixed-period-->

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

<!-- textlint-enable -->

認知では React と Vue のツートップですが、Svelte, SolidJS, Qwik が満足度や継続利用率で上位にランクインしているのが興味深いですね。
また、**JavaScript Rising Stars**では Astro は Next.js に次ぐ 2 位でしたが、**State of JS**では Astro は 1 位となってますね。

# まとめ

本当にフロントエンドはフレームワークが多すぎです...！
ただ、それぞれの大まかな特徴については把握できたので、目的に応じて使い分けていきたいです。
