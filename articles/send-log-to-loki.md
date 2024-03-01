---
title: "GitHub Actions のログを Grafana Loki に送信するアクションを作ってみた"
emoji: "🕹️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["githubactions", "grafana", "devops"]
published: false
---

# はじめに

GitHub Actions の実行タイミングや実行時間を可視化できたら便利だと思い、GitHub Actions のログを Grafana Loki に送信するアクションを作ってみました。

こちらに公開しています。

https://github.com/marketplace/actions/send-log-to-loki

という事で、今回はこのアクションを使用方法を紹介したいと思います。

# 特徴

このアクションの特徴としては以下の通りです。

- GitHub Actions の実行情報 (実行時間や URL など) を Loki に送信できる。
- ログにカスタムメッセージとラベルを含められる。

# 使用方法

ワークフローに下記のアクションを含めるだけです。

```yaml:.github/workflows/***.yml
- name: Send log to Loki
  uses: istone-you/send-log-to-loki@v1
  with:
    message: "ログメッセージを自由に記述"
    measurement: "start"
    loki_address: "http://your-loki-instance:3100"
    loki_username: ${{ secrets.LOKI_USERNAME }}
    loki_password: ${{ secrets.LOKI_PASSWORD }}
    labels: '{"key": "value"}'
```

### 各パラメータの解説

- `message`: Loki に送信するログ メッセージ。
- `measurement`: 開始時間を記録するには「start」を指定して、実行時間を計算して送信するには「finish」を指定。(オプション)
- `loki_address`: Loki の URL。
- `loki_username` Loki にアクセスするためのユーザー名。
- `loki_password`: Loki にアクセスするためのパスワード。
- `labels`: ログ メッセージにラベルとして添付されるキーと値のペアの JSON 文字列。(オプション)

# ログに含まれるラベル

Loki に送信されるログには以下のラベルが含まれます。

- `actor`: 実行者
- `branch`: ブランチ名
- `duration`: 実行時間（`measurement` パラメータに「start」と「finish」を指定したものそれぞれが実行された場合に記録される）
- `job`: ジョブ名
- `measurement`: アクション実行時に指定された `measurement` パラメータの値
- `repositoryName`: リポジトリ名
- `repositoryOwner`: リポジトリ所有者
- `runId`: 実行 ID
- `runNumber`: 実行番号
- `source`: `github-actions`という値が含まれる
- `url`: URL
- `workflow`: ワークフロー名

その他のラベルは、`labels` パラメータで指定したものが含まれます。

# 試してみる

下記ファイルで実行してみます。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

:::details 実行ファイル

<!-- textlint-enable -->

```yaml:.github/workflows/test.yml
name: "GitHub Actionsのテスト"

on:
  workflow_dispatch:
    inputs:
      branch:
        description: "ブランチ名"
        required: true
        default: "main"

jobs:
  github-actions-test:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ inputs.branch }}

      - name: Send log to Loki
        uses: istone-you/send-log-to-loki@v1
        with:
          message: "スタートしました"
          measurement: "start"
          loki_address: ${{ vars.LOKI_ADDRESS }}
          loki_username: ${{ secrets.LOKI_USERNAME }}
          loki_password: ${{ secrets.LOKI_PASSWORD }}
          labels: '{"env": "development", "app": "test"}'

      - name: Sleep 10 seconds
        run: sleep 10

      - name: Send log to Loki
        uses: istone-you/send-log-to-loki@v1
        with:
          message: "フィニッシュしました"
          measurement: "finish"
          loki_address: "https://logs-prod-021.grafana.net"
          loki_username: ${{ secrets.LOKI_USERNAME }}
          loki_password: ${{ secrets.LOKI_PASSWORD }}
          labels: '{"env": "development", "app": "test"}'
```

:::

以下のようにログが送信されました。

![](https://storage.googleapis.com/zenn-user-upload/5a49ade3f29b-20240301.png)
`measurement` パラメータに「start」と「finish」を指定したため、実行時間が計算されて送信されています。
![](https://storage.googleapis.com/zenn-user-upload/21429ceb5e1e-20240301.png)
ラベルに様々な情報が記載されているので、Grafana 等を利用して可視化が捗るのではないでしょうか。

# まとめ

これで簡単に GitHub Actions の実行を可視化できるようになります。ぜひ活用してみてください。

また、[ぼくのかんがえたさいきょうの DevOps 実現構成](https://zenn.dev/istone/articles/297833b006dfd6)という記事にて、こちらを活用した構成を紹介していますので、合わせてご覧いただけると幸いです。
