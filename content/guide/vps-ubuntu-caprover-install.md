---
title: 'OSS PaaSのCaproverをVPSに構築'
tags: ['VPS', 'PaaS', 'CapRover']
type: 'PaaS'
icon: 'Next.js'
---

## Conoha VPSでUbuntuを使う

### ユーザの作成

```
adduser paas
gpasswd -a paas sudo
```

作成したユーザでログインする際も公開鍵認証を使用するのが望ましいため、公開鍵をコピーします。

```
sudo -i -u paas
ssh-import-id-gh GITHUB_USERNAME
```

## 不要なユーザを削除する

### ubuntuユーザの削除

ユーザ一覧
```
less /etc/passwd
```

## ローカルホスト名の変更

```
sudo hostnamectl set-hostname ubuntu2204lts
```

## リポジトリとパッケージを最新化

リポジトリを最新にする。
```
sudo apt update
```

パッケージを最新にする。

```
sudo apt upgrade
```

ホームディレクトリを確認する。

```
ls -lrt
```

## Docker Engineのインストール

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```


```
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

```
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```
sudo apt-get update
```

### Install Docker Engine

```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```


[https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/){:target=”_blank”}

## Firawall設定

Caproverのファイアーウォール

```
sudo ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

## CapRoverの設定

### CapRoverのインストール

```
sudo docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

>Please wait at least 60 seconds before trying to access CapRover.

60秒ほど待ってから、ブラウザでIPアドレスに3000ポートでアクセスしてみましょう。管理画面が表示されます。
初期パスワードは``captain42``です。

http://YOUR_IP_ADDRESS:3000

### RootDomainの設定

DNSを設定する。以下のように設定するとsample1.pandora.nohaco.comやsample2.pandora.nohaco.comのサブドメインでアプリをデプロイできる。またwwwのサブドメインをワイルドキャットなしで設定するとpandora.nohaco.comがルートドメインになる。CapRoverの管理画面は自動的にcaptain.pandora.nohaco.comになる。

- TYPE: A
- HOST: *.pandora.nohaco.com
- IP: YOUR_IP_ADDRESS

www.YOUR_DOMEINを設定する場合。

- TYPE: A
- HOST: www.nohaco.com
- IP: YOUR_IP_ADDRESS

### ローカルマシンにCapRover CLIをインストール

```
npm install -g caprover
```

```
caprover serversetup
```

対話的に質問に答える。

```
? have you already started CapRover container on your server?
? IP address of your server:
? current CapRover password:
? CapRover server root domain:
? "valid" email address to get certificate and enable HTTPS:
? CapRover machine name, with whom the login credentials are stored locally:
```


[https://www.miraiserver.ne.jp/column/about_ubuntu-lts-after-installation/](https://www.miraiserver.ne.jp/column/about_ubuntu-lts-after-installation/){:target="_blank"}
