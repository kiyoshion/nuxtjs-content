---
title: 'OSS PaaSの選び方 〜CaproverとCoolifyの使い心地を比較〜'
tags: ['VPS', 'PaaS', 'CapRover']
type: 'PaaS'
icon: 'Next.js'
---

## OSS PaaS (Open Source Software Plarform as a Service)
日々新しいホスティングサービスが誕生する中、個人開発をしてるとデプロイ先の選定で悩みことが多々あります。その度にドキュメントを読んだり、情報収集したりと何かと時間が奪われるものです。それなら自前のPaaSをつくってしまえば良いのでは、ということで自前のVPSにOSS PaaSを入れてみました。Heroku無料プラン終了の代替案にぜひ。

## VPSにmini Herokuをぶち込む
ひとくちにOSS PaaS（mini Herokuっていわれてるみたい）といっても多くのOSSがあります。その中で以下の条件で選定してみました。特に個人開発者向け(いろんなスタックのwebアプリをデプロイしたい人)かなと思います。

- 個人開発　:point_right:　コスパ重視
- コマンド忘れる　:point_right:　GUI
- スタックごとに管理したい　:point_right:　docker

### メリット

- 複数のアプリやサイトをGUIで一元管理できる
- 異なるスタック、異なるバージョンでも共存できる
- ベンダーの料金体系にビクビクしない

放置してるアプリとかがあると重宝するかな（バージョンあげるのめんどｋ）。

### デメリット

- 処理が若干重くなる（体感）
- Dockerイメージの容量がでかい

dockerなのでトレードオフで。

## CapRover vs Coolify

||CapRover|Coolify|
|----|----|----|
|推奨スペック<br>OS(Supported)<br>CPU<br>RAM<br>DISK|<br>Ubuntu 20.04 ><br>-<br>1 GB<br>-|<br>Debian<br>2 CPUs<br>2 GB<br>30 GB|
|ドキュメント|○|△|
|One-click Apps<br>|291<br>(Apps and DBs)|42<br>(35 Apps and 7 DBs)|
|デプロイ方法|CLI<br>Tarball(.tar)<br>Github/Bitbucket/Gitlab<br>Dockerfile<br>Dokcer image||
|docker compose|○|○|

One-Click Appsはどちらもワンクリックでコンテナを作成する機能。主要なDBはどちらも網羅しています。

## CapRover

### Pros:


### Cons:
- dokcer-composeは独自のタグを埋め込まないと使えない

## Coolify

### Pros:
- docker-composeがそのまま使える

### Cons:
- ドキュメントが薄くてやりたいこと探すの大変

## おまけ Portainer

Portainerはホスト内のdocker containerを一元管理するGUIツールです。こちらも試してみましたがSSL化やドメインの設定などは画面からできないようで、すぐに撤退しました。（jwilder/nginx-proxyやjrcs/letsencrypt-nginx-proxy-companionのDockerイメージを使って手動で構築する？）docker composeでそのままデプロイできるので、サーバに単体のアプリをぶち込むなら良さそうですね。

## まとめ

- LaravelやFastAPIのフレームワークをデプロイするときはdokcer composeでデプロイしたい
- 複数コンテナ(web, app, dbとか)必要ならdocker composeがそのまま使える方がうれしい
- コンテナ用意してネットワーク繋げてコンテナ入ってコマンド打ってはやりたくない
- どちらもNextjsやNuxtjsでつくった静的サイトはNetlifyライクにGitHub経由で簡単にデプロイできた
- 個人的にOnclick-Appsに期待してたけどDBとWordPressぐらいしか使えそうなものがなかった

だから私は、Coolify。
