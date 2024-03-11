---
title: "GrafanaのダッシュボードをSlackに投稿する（メールの画像を Slack に投稿する）"
emoji: "📌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["aws", "nodejs", "terraform", "grafana", "slack"]
published: false
publication_name: "microcms"
---

# はじめに

皆さん監視用のダッシュボードを確認してますか？

せっかくダッシュボードを作成しても、ダッシュボードを確認する機会というのは残念ながら少ないでしょう。
ですが、今回紹介する Grafana のダッシュボードのスクリーンショットを定期的に Slack に送信する方法を使用すれば、ダッシュボードを確認する機会が増え、ダッシュボードの有効活用が期待できます。

実際には Grafana のダッシュボードのスクリーンショットを Slack に送信する機能というのは存在しないので、今回はメールでダッシュボード送信する機能を利用して Slack にダッシュボードのスクリーンショットを送信してみます。
メールから画像を抽出して Slack に通知する Lambda を作成します。

# 前提

前提として AWS と Slack のアカウント作成とログインを行っているものとします。
また、メール受信に使用できるドメインが必要となりますので、Route53 にて準備しておいてください。

これらの説明については割愛しますので、ご了承お願いします。

# 構成

Slack と以下の AWS のサービスを使用します。

- S3
- Lambda
- SES

これらのリソースを Terraform で構築し、Lambda のコードには Node.js を使用します。

# Slack アプリを作成

まずは Slack にアプリを作成します。下記 URL にアクセスして「**Create New App**」をクリックしてください。

https://api.slack.com/apps/

「**From scratch**」をクリックします。

![](https://storage.googleapis.com/zenn-user-upload/3bc366a4dcb7-20240311.png)

<br>

「**App Name**」に任意の名前を入力し、「**Pick a workspace to develop your app in:**」に自分のワークスペースを選択して、「**Create App**」をクリックします。

![](https://storage.googleapis.com/zenn-user-upload/9c28ac21bdc9-20240311.png)

<br>

すると、アプリの設定画面に遷移します。左メニューの「**OAuth & Permissions**」をクリックしてください。

![](https://storage.googleapis.com/zenn-user-upload/10da5e1d1c05-20240311.png)

<br>

下にスクロールして「**Scopes**」にある「**Bot Token Scope**」の「**Add an OAuth Scope**」から「chat:write」と「files:write」を追加します。

![](https://storage.googleapis.com/zenn-user-upload/e020d748b079-20240311.png)

<br>

追加したら、上にスクロールして「**OAuth Tokens for Your Workspace**」の「**Install to Workspace**」をクリックします。

![](https://storage.googleapis.com/zenn-user-upload/6a83fa219c3c-20240311.png)

<br>

「**許可する**」をクリックします。

![](https://storage.googleapis.com/zenn-user-upload/402b86cccf42-20240311.png)

<br>

すると、「**OAuth Tokens for Your Workspace**」に「**Bot User OAuth Token**」が表示されます。後ほど使用しますので、これを控えておいてください。

![](https://storage.googleapis.com/zenn-user-upload/56004b2f4d4b-20240311.png)

<br>

# Route53 にて MX レコードを設定

次はメールを受信するために Route53 にて MX レコードを設定します。コンソール画面は使用せず、AWS CLI を使用して設定します。

下記コマンドを実行してください。<Route53 のホストゾーン ID>と<ドメイン名>には適切な値を入力してください。
また、ここではサブドメインを _mail_ として設定していますが、こちらも適宜変更してください。

```bash
aws route53 change-resource-record-sets --hosted-zone-id <Route53のホストゾーンID> --change-batch '{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "mail.<ドメイン名>",
        "Type": "MX",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "10 feedback-smtp.ap-northeast-1.amazonses.com"
          }
        ]
      }
    }
  ]
}'
```

作成した「_mail_.<ドメイン名>」をメール受信用のドメインとして使用します。

# Node.js のコード

続いて Lambda 関数のコードを Node.js で作成します。

```js:index.js
const AWS = require("aws-sdk");
const { simpleParser } = require("mailparser");
const { WebClient } = require("@slack/web-api");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );

    const emailData = await s3
      .getObject({
        Bucket: bucketName,
        Key: objectKey,
      })
      .promise();

    const parsedEmail = await simpleParser(emailData.Body);
    const channelId = extractChannelId(parsedEmail);
    const slackToken = process.env.SLACK_TOKEN;

    for (const attachment of parsedEmail.attachments) {
      if (attachment.contentType.startsWith("image/")) {
        await uploadImageToSlack(
          attachment.content,
          attachment.filename,
          parsedEmail.subject,
          channelId,
          slackToken
        );
      }
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// メール本文からSlackのチャンネルIDを抽出する関数
function extractChannelId(parsedEmail) {
  const text = parsedEmail.text || parsedEmail.html;

  const channelIdMatch = text.match(/Slack:\s*(C[A-Za-z0-9]+)/);
  if (!channelIdMatch) {
    throw new Error("Slack Channel ID not found in email body.");
  }

  return channelIdMatch[1];
}

// 画像をSlackにアップロードする関数
async function uploadImageToSlack(
  fileContent,
  fileName,
  subject,
  channelId,
  token
) {
  const web = new WebClient(token);

  try {
    const response = await web.files.uploadV2({
      initial_comment: `*${subject}*`,
      file: fileContent,
      filename: fileName,
      channel_id: channelId,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image to Slack: ${response.error}`);
    }
  } catch (error) {
    console.error("Error uploading image to Slack:", error);
    throw error;
  }
}
```

# Terraform のコード

Terraform で Lambda 関数と IAM ロール、S3 バケットを作成します。

## Lambda

メインの Lambda 関数です。

```hcl:lambda.tf
resource "aws_lambda_function" "grafana_notification" {
  count         = local.enable_stg
  function_name = "grafana-notification-${local.env}"

  source_code_hash = data.archive_file.grafana_notification.output_sha
  s3_bucket        = aws_s3_bucket.grafana_notification_s3[0].bucket
  s3_key           = aws_s3_object.grafana_notification_s3[0].key
  role             = aws_iam_role.grafana_notification_role[0].arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = "60"

  environment {
    variables = {
      SLACK_TOKEN = data.aws_ssm_parameter.slack_token[0].value,
    }
  }
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  count  = local.enable_stg
  bucket = "<適当なバケット名を入力>"

  lambda_function {
    lambda_function_arn = aws_lambda_function.grafana_notification[0].arn
    events              = ["s3:ObjectCreated:*"]
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  count         = local.enable_stg
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.grafana_notification[0].function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.grafana_notification_s3.arn}"
}
```

## S3

コードをアップロードする S3 バケットと、メールを受信するための S3 バケットを作成します。

```hcl:s3.tf
resource "aws_s3_bucket" "grafana_notification_s3" {
  count  = local.enable_stg
  bucket = local.grafana_notification_s3_bucket
}

resource "aws_s3_object" "grafana_notification_s3" {
  count  = local.enable_stg
  bucket = local.grafana_notification_s3_bucket
  key    = local.grafana_notification_s3_key
  source = data.archive_file.grafana_notification.output_path
  etag   = filemd5(data.archive_file.grafana_notification.output_path)

  depends_on = [aws_s3_bucket.grafana_notification_s3[0]]
}
```

## SES

メールを受信するための SES のルールセットを作成します。

```hcl:ses.tf

```

## IAM

Lambda 関数の実行ロールとポリシーを作成します。

```hcl:iam.tf
resource "aws_iam_role_policy" "grafana_notification_policy" {
  count = local.enable_stg
  name  = "<適当なポリシー名を入力>"
  role  = aws_iam_role.grafana_notification_role[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "s3:GetObject"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.grafana_notification_s3.arn}/*"
        ]
      }
    ]
  })
}
resource "aws_iam_role" "grafana_notification_role" {
  count = local.enable_stg
  name  = "<適当なロール名を入力>"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}
```

# Grafana の設定

Grafana からダッシュボードをメールで送信する設定をします。送信先には先ほど作成した SES のメールアドレスを使用しましょう。

# おわりに

以上で Grafana のダッシュボードのスクリーンショットを Slack に送信する機能を作成しました。今回はメールから画像を抽出して Slack に送信する Lambda を作成したので、Grafana だけでなく様々な場面で使用できるかと思います。是非ご活用ください！
