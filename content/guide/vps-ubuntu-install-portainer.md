---
title: 'VPSのUbuntu22.04にPortainerをインストールする'
tags: ['VPS', 'PaaS', 'Portainer']
type: 'PaaS'
icon: 'Next.js'
---

## Ubuntu 22.04 LTSの設定

### ユーザの作成

```
adduser ubuntu22
```

```
root@133-130-102-73:~# adduser ubuntu22
Adding user `ubuntu22' ...
Adding new group `ubuntu22' (1000) ...
Adding new user `ubuntu22' (1000) with group `ubuntu22' ...
Creating home directory `/home/ubuntu22' ...
Copying files from `/etc/skel' ...
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for ubuntu22
Enter the new value, or press ENTER for the default
```
```
gpasswd -a ubuntu22 sudo
```

```
root@133-130-102-73:~# gpasswd -a ubuntu22 sudo
Adding user ubuntu22 to group sudo
```

作成したユーザでログインする際も公開鍵認証を使用するのが望ましいため、公開鍵をコピーします。

```
sudo -i -u ubuntu22
```

ユーザ一覧
```
less /etc/passwd
```

### open SSHのファイアーウォールを制限する

```
sudo ufw limit 22
[sudo] password for ubuntu22:
Rule added
Rule added (v6)
```

```
sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
```

[https://gihyo.jp/admin/serial/01/ubuntu-recipe/0751](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0751){:target="_blank"}

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

最新のDocker Engineをインストールをするため以下のドキュメンからコマンドをコピペします。

[https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/){:target=”_blank”}

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

```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### docker composeをインストールする

[https://docs.docker.com/compose/install/linux/](https://docs.docker.com/compose/install/linux/){:target="_blank"}

```
sudo apt-get update
sudo apt-get install docker-compose-plugin
sudo docker compose version
Docker Compose version v2.20.2
```
