---
title: "Terragruntでモノレポの差分デプロイを実現する"
emoji: "🔍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["aws", "terraform", "devops", "iac", "terragrunt"]
published: false
publication_name: "microcms"
---

# はじめに

# Terragrunt とは

# Terragrunt でモノレポの差分デプロイを実現する

以下のようなモノレポを想定します。

```text
├── backend1/
├── backend2/
├── frontend1/
├── frontend2/
└── terraform/
```

`terraform/` ディレクトリに　各ディレクトリ用の Terraform コードを用意します。

```text
└── terraform/
   ├── backend1/
   ├── backend2/
   ├── frontend1/
   └── frontend2/
```

各ディレクトリにハッシュを計算するスクリプトを用意します。

```bash:get_hash.sh
#!/bin/bash

find "../../backend1" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/README.md" \
  -exec sha256sum {} \; |
  sort | sha256sum
```

こちらは `../../backend1` ディレクトリにあるファイルのハッシュを、`node_modules` や `README.md` を除外して計算しています。

`root.hcl` に `after_hook` と `exclude` を設定します。

```hcl:root.hcl
terraform {
  after_hook "get_hash" {
    commands = ["apply"]
    execute = [
      "bash", "-c", "echo $(bash ./get_hash.sh) > .terraform.sha256sum"
      EOT
    ]
  }
}

exclude {
  if = run_cmd("bash", "-c", <<-EOT
if [ "${get_terraform_command()}" != "apply" ]; then
  exit 0
fi

if [ "${get_env("SKIP_HASH_CHECK", "false")}" = "true" ]; then
  echo -ne "...\r"
  exit 0
fi

touch .terraform.sha256sum
HASH_OUTPUT=$(bash ./get_hash.sh)

if printf "%s" "$(bash ./get_hash.sh)" | diff - .terraform.sha256sum >/dev/null; then
  exit 0
else
  echo -e "\e[36m[${path_relative_to_include()}]\e[0m"
  echo "Diff detected."
fi
    EOT
    ) == ""
  actions = ["apply"]
}
```

# まとめ