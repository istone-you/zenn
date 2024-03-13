---
title: "多すぎるフロントエンドのフレームワークを整理する"
emoji: "🗂️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "react", "vue", "frontend"]
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

- 拡張子は `.jsx` または `.tsx`
- 仮想 DOM を使用する
- 単方向データバインディング

## Next.js

## Remix

## Gatsby.js

# Vue

- 拡張子は `.vue`
- 仮想 DOM を使用する
- 双方向データバインディング

## Nuxt.js

- Vue 版の Next.js

# Svelte

- 拡張子は `.svelte`
- 仮想 DOM を使用しない
- Vanilla JS に近い形でコンパイルされる

## SvelteKit

- Svelte 版の Next.js

# SolidJS

- 拡張子は `.jsx` または `.tsx`
- 仮想 DOM を使用しない
- Vanilla JS に近い形でコンパイルされる
- Svelte との違いは書き方が React に近い

## SolidStart

- SolidJS 版の Next.js

# Qwik

- 拡張子は `.jsx` または `.tsx`
- 初期ロード時に必要なコードのみを送信し、その後必要に応じて追加のコードをロード

## Qwik City

- Qwik 版の Next.js

# Astro

- 拡張子は `.astro`
