---
title: "開発効率を爆上げ！fzf × go-task でコマンド実行を TUI 化する"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["devops", "開発環境"]
published: false
publication_name: "microcms"
---

# はじめに

# fzf と go-task とは

## fzf

## go-task

# fzf で go-task を TUI 化する

## タスクリストを作成する

まずは、`tasklist.txt` という task のリストを記載したファイルを作成します。

`$ task update` で `tasklist.txt` を作成・更新できるようにします。
この時 task 名だけ取得したいので、`grep` や `awk`、`sed`を使って整形します。

```yaml:Taskfile.yml
    update:
        cmds:
        - |
            task -l | 
                grep -v '^task: Available tasks for this project:$' | 
                awk -F': ' '{print $1}' | 
                sed 's/^[ *]*//' > .tasklist.txt
```

これで、`task update` を実行すると `tasklist.txt` が作成・更新されます。

```text:tasklist.txt
fmt
lint
test
deploy
```

ファイルを用意せずに、毎回このコマンドを実行するのでもいいですが、task が多くなると実行時間が遅くなり、体験が悪くなるために予め用意しておきます。

## default タスクを作成する

`default` というタスクを作成すれば、タスクが指定されなかった時に実行されるコマンドを用意できます。
`fzf` と先ほど作成した `tasklist.txt` を使ってタスクを選択できるようにしましょう。

```yaml:Taskfile.yml
  default:
    vars:
      TASK:
        sh: |
            selected_task=$(
            cat .tasklist.txt | fzf \
                --prompt="Select Task: " \
                --layout=reverse --border --inline-info \
                --preview 'task {} --summary' --preview-window=right:60%:wrap
            )
            echo "$selected_task"
    cmds:
      - task {{.TASK}}
```

これで、`task` をタスク指定なしで実行すると、`fzf` でタスクを選択できるようになりました。

```bash
$ task
```

# 各 task の引数も選択実行できるようにする

# さらに効率を上げる

これでも十分に便利になったのですが、さらに開発効率を上げましょう！

## alias を設定する

`~/.bashrc` や `~/.zshrc` に alias を設定して、`task` を `t` だけで実行できるようにします。

```bash
alias t='task'
```

## ショートカットを設定する

キーボードのショートカットでも実行できるようにしておくと、さらに便利です。

```bash
exec-task() {
    BUFFER="task"
    CURSOR=$#BUFFER
    zle accept-line
}
zle -N exec-task
bindkey '^T' exec-task # 他のキーに変更したい場合は `^T` を変更
```

これで、`Ctrl + T` で `task` を実行できるようになります。

## hisotry に記録する

選択して実行しても、ターミナルの history には `task` としか記録されません。
もう一度同じタスクを実行しようとして `↑` キーを押しても、`$ task` しか呼び出せません。

これを解決するために全ての task に `defer` を設定します。`defer` は、タスクの実行完了後に実行されるコマンドを設定できます。

まずは history に記録するための task を用意します。

```yaml:Taskfile.yml
  defer-task:
    silent: true # 実行時に出力しない
    cmds:
      - history -s "task {{.CLI_ARGS}}" # bash の場合
      - zsh -i -c 'print -s "task {{.CLI_ARGS}}"' # zsh の場合
```

この task を全ての task の `defer` に設定します。

```yaml:Taskfile.yml
  deploy:
    cmds:
      - defer: task defer-task -- {{.CLI_ARGS}}
      - terraform apply
```

これで選択して実行したタスクが history に記録されるようになりました。

```bash
$ task
```

```bash
cat ~/.bash_history
task deploy # task ではなく task deploy として記録される
```



# まとめ