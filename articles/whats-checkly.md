---
title: "外形監視とE2E テストができるCheckly とは？"
emoji: "🦝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["aws", "githubactions", "terraform", "grafana", "devops"]
published: true
---

今回は、外形監視と E2E テストができる Checkly というサービスについて簡単に紹介します。

# Checkly とは

**Checkly**は外形監視と E2E テストが行える SaaS です。E2E テストには[**Playwright**](https://playwright.dev/)を使用します。

https://www.checklyhq.com/

Sentry や Vercel、1Password などの有名企業が利用しており、信頼性の高さが伺えます。

# Datadog との比較

Datadog との比較はこちらのサイトをご覧ください。料金的なメリットや、Playwright が使用できる等の違いがあります。

https://www.checklyhq.com/datadog-alternative/

# 外形監視とは

外形監視（合成監視とも呼ばれる）は、ウェブサイトやアプリケーションの性能を定期的にテストし、ユーザーの視点からサービスの可用性や応答時間を監視することです。
これにより、ユーザーがサービスを使用する際に直面する可能性のある問題を事前に検出し、修正できます。

# E2E テストとは

E2E テストは、アプリケーションやシステムの全体的なフローを通じて、実際のユーザーシナリオをシミュレートしてテストすることです。
これにより、アプリケーションの品質を向上させ、ユーザーが期待どおりの機能を使用できることを保証できます。

# 外形監視と E2E テストの違い

外形監視と E2E テストは似てますが、外形監視は実稼働環境でアプリを継続的にテストすることを目的としており、E2E テストはデプロイ前にバグを検出することを目的としています。

# 外形監視を試してみる

※ アカウント登録については割愛します。

早速 Checkly にログインし、新しいチェックを作成します。
サイドバーから+ボタンをクリックします。

![](https://storage.googleapis.com/zenn-user-upload/eb4e600c39f9-20240301.png)

<br>

Bolower check・API check・Multistep check の 3 種類のチェックが作成できるようです。
まずは API check を作成してみます。

![](https://storage.googleapis.com/zenn-user-upload/5c315c345eb8-20240301.png)

CHECK NAME は適当に「Test Check」とします。

![](https://storage.googleapis.com/zenn-user-upload/ae73eb1a9bc1-20240301.png)

<!-- textlint-disable ja-technical-writing/no-unmatched-pair -->

テストとして Zenn のトップページ（https://zenn.dev）を指定します。

<!-- textlint-enable -->

![](https://storage.googleapis.com/zenn-user-upload/306d14b1a424-20240301.png)

チェックの前にスクリプトが実行できるようです。また、レスポンス時間の制限も設定できるようです。
今回はデフォルトのままとします。

![](https://storage.googleapis.com/zenn-user-upload/7205ddd74a63-20240301.png)

どのようなデータが返却されれば成功とするかを設定します。今回は以下の項目をチェックします。

- **Status code**: 200 かどうかをチェック
- **Response time**: 100ms 未満かどうかをチェック
- **Header**: `Content-Type`が t`text/html; charset=utf-8`かどうかをチェック
- **Text body**: `lang="ja"`が HTML 内に含まれているかどうかを正規表現でチェック

![](https://storage.googleapis.com/zenn-user-upload/058eabf69999-20240301.png)

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

スケージュール戦略を設定します。今回はデフォルトの Prallel runs を選択し、

<!-- textlint-enable -->

![](https://storage.googleapis.com/zenn-user-upload/c69c1b0c2fcb-20240301.png)

リージョンは東京と大阪を選択します。

![](https://storage.googleapis.com/zenn-user-upload/15ea29569e6c-20240301.png)

チェックの間隔を設定します。今回はデフォルト設定の 5 分間隔とします。

![](https://storage.googleapis.com/zenn-user-upload/49af566e88ac-20240301.png)

失敗した際のリトライの設定です。デフォルト設定の 1 分後と 2 分後にリトライするように設定します。

![](https://storage.googleapis.com/zenn-user-upload/f931b273776f-20240301.png)

最後にアラートの通知先の設定です。事前に Email や Slack などの通知先を設定しておくか、このチェックのみの通知先を設定できます。

![](https://storage.googleapis.com/zenn-user-upload/a376b918dfa6-20240301.png)

ここまで設定できたら「Run & Save」をクリックします。
結果が表示されて、チェックが成功している事が分かります。

![](https://storage.googleapis.com/zenn-user-upload/c75e40a65016-20240301.png)

これで 5 分ごとに Zenn のトップページの外形監視が行われるようになりました。

# E2E テストを試してみる

次は E2E テストを作成してみます。
再度サイドバーから+ボタンをクリックします。

![](https://storage.googleapis.com/zenn-user-upload/eb4e600c39f9-20240301.png)

<br>

Bolower check を選択します。

![](https://storage.googleapis.com/zenn-user-upload/ffc3b4e7dc27-20240301.png)

Check CLI が使用できたり、Playwright Test Generator が使用できるようですが、今回は「Start from scratch」から作成します。

![](https://storage.googleapis.com/zenn-user-upload/2f197f77ba9f-20240301.png)

CHECK NAME は適当に「Test Check #2」とします。

![](https://storage.googleapis.com/zenn-user-upload/dddd43d628f5-20240301.png)

「Setting」からテストの設定が行えるようです。

![](https://storage.googleapis.com/zenn-user-upload/931fa9597772-20240301.png)

テストのスケジュール設定やロケーションの設定はこちらから行えます。今回はデフォルトのままとします。

![](https://storage.googleapis.com/zenn-user-upload/bce26d933d8a-20240301.png)

デフォルトで Playwright を使用した JavaScript のコードが用意されているので、これをそのまま実行してみましょう。
「Run Script」をクリックします。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

:::details デフォルトのコード

<!-- textlint-enable -->

Checkly の環境変数`ENVIRONMENT_URL`に設定した URL、もしくは Checkly の公式サイトにアクセスしてスクリーンショットを撮影し、レスポンスが 400 未満であることを確認するテストです。

```js
/**
 * To learn more about Playwright Test visit:
 * https://www.checklyhq.com/docs/browser-checks/playwright-test/
 * https://playwright.dev/docs/writing-tests
 */

const { expect, test } = require("@playwright/test");

// Set the action timeout to 10 seconds to quickly identify failing actions.
// By default Playwright Test has no timeout for actions (e.g. clicking an element).
// Learn more here: https://www.checklyhq.com/docs/browser-checks/timeouts/
test.use({ actionTimeout: 10000 });

test("visit page and take screenshot", async ({ page }) => {
  // Change checklyhq.com to your site's URL,
  // or, even better, define a ENVIRONMENT_URL environment variable
  // to reuse it across your browser checks
  const response = await page.goto(
    process.env.ENVIRONMENT_URL || "https://checklyhq.com"
  );

  // Take a screenshot
  await page.screenshot({ path: "screenshot.jpg" });

  // Test that the response did not fail
  expect(
    response.status(),
    "should respond with correct status code"
  ).toBeLessThan(400);
});
```

:::

![](https://storage.googleapis.com/zenn-user-upload/0c16dcda75f1-20240301.png)

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

しばらく待ちましょう 🍵

<!-- textlint-enable -->

<br>

画面下部にある「RUN LOGS」を確認すると、Playwright のテストに pass していることが分かります。

![](https://storage.googleapis.com/zenn-user-upload/652c97d3d798-20240301.png)

また、コードエディタの左側には「TEST REPORT」が表示されており、テストの結果を確認できます。
Videos や Screenshots も確認できるので便利ですね。

![](https://storage.googleapis.com/zenn-user-upload/4932277ceb10-20240301.png)

# まとめ

今回は、外形監視と E2E テストができる Checkly について紹介しました。UI に優れていて使いやすいですし、料金的なメリットもあるので、ぜひ一度試してみてください。

また、[**ぼくのかんがえたさいきょうの DevOps 実現構成**](https://zenn.dev/istone/articles/297833b006dfd6)という記事にて、Checkly を活用した構成を紹介していますので、合わせてご覧いただけると幸いです。
