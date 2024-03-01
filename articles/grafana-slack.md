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

Grafana のダッシュボードのスクリーンショットを Slack に送信する機能というのは存在しませんが、メールでダッシュボード送信する機能を利用して Slack にダッシュボードのスクリーンショットを送信してみます。

# 構成

以下の AWS のサービスを使用します。

- S3
- Lambda
- SES

これらのリソースを Terraform で構築し、Lambda のコードには Node.js を使用します。

# Slack アプリを作成

# Node.js のコード

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

  // メール本文からSlackチャンネルIDを取得
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

## Lambda

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
