---
title: "GitHub Actions のログを Grafana Loki に送信するアクションを作ってみた"
emoji: "🕹️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["githubactions", "grafana", "devops"]
published: false
---

# はじめに

GitHub Actions の実行タイミングや実行時間を可視化できたら便利だと思い、GitHub Actions のログを Grafana Loki に送信するアクションを作ってみました。

こちらです。

https://github.com/marketplace/actions/send-log-to-loki

という事で、今回はこのアクションを使用方法を紹介したいと思います。

# 特徴

このアクションの特徴としては以下の通りです。

- GitHub Actions の実行情報 (開始時間と終了時間など) を Loki に送信する。
- ログのラベルに 対象の GitHub Actions の URL が含まれる。
- ログにカスタムメッセージとラベルを含められる。

# 使用方法

## ステップ 1:アクションを設定

次のステップを追加して、ワークフローにアクションを含めます。

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

## ステップ 2: Loki 資格情報を GitHub シークレットに追加する

セキュリティ上の理由から、Loki 認証情報 (LOKI_USERNAME および LOKI_PASSWORD) を GitHub リポジトリ シークレットに保存することをお勧めします。

## ステップ 3: ログを受信するように Loki を構成する

Loki インスタンスが HTTP 経由でログを受信するように設定されていることを確認してください。Loki サーバーのセットアップに関するガイダンスについては、[Loki のドキュメント](https://grafana.com/docs/loki/latest/setup/)を参照してください。

# Loki にどのようにログが送信されるか

## ログに含まれるラベル

- `actor`: 実行者
- `branch`: ブランチ名
- `duration`: 実行時間（`measurement` パラメータに「start」と「finish」を指定したものそれぞれが実行された場合に記録される）
- `measurement`: アクション実行時に指定された `measurement` パラメータの値
- `repositoryName`: リポジトリ名
- `repositoryOwner`: リポジトリ所有者
- `runId`: 実行 ID
- `runNumber`: 実行番号
- `source`: `github-actions`という値が含まれる
- `url`: URL
- `workflow`: ワークフロー名

その他のラベルは、`labels` パラメータで指定したものが含まれます。

# まとめ

これで簡単に GitHub Actions の実行方法を可視化できるようになりました。ぜひお試しください。
