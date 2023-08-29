---
title: 'CapRoverにLaravelをデプロイする'
tags: ['Laravel', 'CapRover']
type: 'PaaS'
icon: 'Laravel'
---

## CapRoverにLaravelをデプロイする

今回デプロイするLaravelは`Laravel 10x`+`React 18x`+`MySQL 8x`+`Nginx`という構成です。WebサーバはCapRoverのNginxを使うので用意しません。使用するDockerイメージ、Webアプリ、リポジトリは以下です。

### Docker Image

- php:8.2-fpm-alpine
- mysql:8.0

### Web app

<my-img name="deploy-laravel-with-caprover-hello-inertia.jpg" slug="guide"></my-img>

[https://hello-inertia.pandora.nohaco.com](https://hello-inertia.pandora.nohaco.com){:target="_blank"}

<ogp-card url="https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494"></ogp-card>

### Git

[Hello Inertia - GitHub](https://github.com/kiyoshion/hello-inertia/tree/caprover){:target="_blank"}

## CapRoverにアプリをデプロイする方法

1. Official CLI　:point_left:　Laravel
2. Tarball(.tar)
3. Deploy from Github/Bitbucket/Gitlab
4. Deploy plain Dockerfile　:point_left:　MySQL
5. Deploy captain-definition file
6. Deploy via ImageName

CapRoverにアプリをデプロイする方法はいくつかありますが、今回はLaravelをCLI、MySQLをDockerfileでデプロイします。Docker composeを使えばいいのでは？と思うかもしれません。しかしCapRoverはdocker composeを部分的にしかサポートしていません。汎用性を考慮してプレーンなDockerfileでデプロイすることにします。ちなみにCapRoverがサポートしているパラメータは`image`, `environment`, `ports`, `volumes`, `depends_on`, `hostname`です。足りますか？

>Specifically, it only supports: image, environment, ports, volumes, depends_on, and hostname, other parameters are currently being ignored by CapRover.

[Docker Compose - CapRover](https://caprover.com/docs/docker-compose.html){:target="_blank"}

### CapRoverにCLIでLaravelをデプロイする流れ

Laravelをデプロイする全体の流れは以下のとおりです。管理画面からコンテナをつくって、PHPコンテナに向けてCLIでデプロイします。

|作業内容|実行|
|---|---|
|1. MySQLのコンテナをつくる|管理画面|
|2. PHPのコンテナをつくる|管理画面|
|3. デプロイ用のファイルをつくる|開発端末|
|4. CLIでデプロイする|開発端末|

それではさっそく始めましょう。

## 1. MySQLのコンテナをつくる

CapRoverの管理画面からMySQLのコンテナをつくります。

### 1.1 Create-new-app

わかりやすい名前をつけましょう。ここではhello-inertia-mysqlとしています。データを永続化させるため`Has Persistent Data`にチェックを入れます。

### 1.2. 管理画面から作成したMySQLを選択

作成したコンテナを選択します。

### 1.3. Http Settings

MySQLなどのデータベースはWebアプリとして使わないので`Do not expose as web-app`にチェックを入れます。

### 1.4. App Configs

`環境変数(Environmental Variables)`と`ボリューム(Persistent Directories)`を設定します。適宜、環境変数を置き換えてください。

<my-img name="deploy-laravel-with-caprover-mysql-app-configs.jpg" slug="guide"></my-img>

#### 環境変数(Environmental Variables)
```
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=hello_inertia
MYSQL_USERNAME=hello_inertia
MYSQL_PASSWORD=password
```

#### ボリューム(Persistent Directories)
```
/var/lib/mysql
```

### 1.5. Deployment

Method 4: `Deploy plain Dockerfile`にMySQLのイメージを指定してデプロイします。

<my-img slug="guide" name="deploy-laravel-with-caprover-mysql-deploy.jpg"></my-img>

```
FROM mysql:8.0
```

これでMySQLの構築が完了です。ホスト名は`srv-captain-- + APP_NAME`という具合にプレフィックスが自動でつきます。上記の場合、ホスト名は`srv-captain--hello-inertia-mysql`になります。LaravelでDBのホスト名を指定するときに使います。

## 2. PHPのコンテナをつくる

### 2.1. Create-new-app

今回はユーザがアップロードした画像をローカル(Application server)上に保存したいので`Has Persistent Data`にチェックを入れます。S3などに画像を保存する場合は不要です。

### 2.2. Http settings

Httpsの有効化と強制リダイレクトを設定しておきます。

### 2.3. App Configs

Laravelを手動でデプロイするときは`.env.sample`をコピーして`.env`に環境変数を設定するかと思います。CapRoverでは管理画面のApp Configsで`.env`の値を定義します。今回設定した値は以下のとおりです。

#### Environment Variables

```
APP_NAME=Hello Inertia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hello-inertia.pandora.nohaco.com
ASSET_URL=https://hello-inertia.pandora.nohaco.com

DB_CONNECTION=mysql
DB_HOST=srv-captain--hello-inertia-mysql
DB_PORT=3306
DB_DATABASE=hello_inertia
DB_USERNAME=hello_inertia
DB_PASSWORD=password

SESSION_DOMAIN=hello-inertia.pandora.nohaco.com
SANCTUM_STATEFUL_DOMAINS=hello-inertia.pandora.nohaco.com
SESSION_SECURE_COOKIE=true

VITE_APP_NAME=Hello Inertia
VITE_OGP_TWITTER_SITE=@kiyoshion
VITE_OGP_TWITTER_DOMAIN=hello-inertia.pandora.nohaco.com
```

#### Persitent Directories

後ほど説明しますが、Dockerfileで`WORKDIR`を`/srv/app`にしています。デフォルトでは`PROJECT_ROOT/storage/app/public`ディレクトリ配下にユーザがアップロードした画像が保存されます。

```
/srv/app/storage/app/public
```

## 3. デプロイ用のファイルをつくる

以下の作業から開発端末で行います。開発したLaravelプロジェクトに`.deploy`ディレクトリと`captain-definition`を追加します。これらはCapRoverの公式ドキュメントで紹介されているLaravel用のデプロイリポジトリです。こちらの構成を参考にコピペ、修正しました。

PROJECT
```
.
├──.deploy
│  ├── config
│  │   ├── supervisor.conf
│  │   ├── php
│  │   │   └── local.ini
│  │   ├── crontab
│  │   └── Caddyfile
│  ├── Dockerfile
│  └── entrypoint.sh
└── captain-definition
```

[Sample Apps - CapRover](https://caprover.com/docs/sample-apps.html){:target="_blank"}<br>[larvel-caprover-template - GitHub](https://github.com/jackbrycesmith/laravel-caprover-template){:taget="_blank"}


### 3.1. captain-definitionをつくる

`captain-definition`はCLIでデプロイするために必要なファイルです。プロジェクトルートに`captain-definition`というファイルをつくります。

captain-definition
```
{
  "schemaVersion" :2 ,
  "dockerfilePath" : "./.deploy/Dockerfile"
}
```

### 3.2. Dockerfileをつくる

`.env`はCapRoverの管理画面で管理します。Dockerfileの書き方は割愛しますがほとんど`ARG(変数)`です。ざっくりとしたコマンドの内容は以下のとおりです。

1. php:8.2-fpm-alpineのイメージを使う
2. PHP extensionsをインストール (PHP拡張を一括インストールしてくれるライブラリ)
3. Node.jsをインストール（React, Vite, Inertiaで使う）
4. composerをインストール
5. appユーザを追加（root以外の作業ユーザ）
6. ARGの設定（CapRoverの管理画面で.envを管理）
7. entrypoint.shを実行

.deploy/Dockerfile
```
ARG PHP_VERSION=${PHP_VERSION:-8.2}
FROM php:${PHP_VERSION}-fpm-alpine AS php-system-setup

# Install system dependencies
RUN apk add --no-cache dcron busybox-suid libcap curl zip unzip git

# Install PHP extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/
RUN install-php-extensions intl bcmath gd pdo_mysql pdo_pgsql opcache redis uuid exif pcntl zip

# Install supervisord implementation
COPY --from=ochinchina/supervisord:latest /usr/local/bin/supervisord /usr/local/bin/supervisord

# Install caddy
COPY --from=caddy /usr/bin/caddy /usr/local/bin/caddy
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/caddy

# Install Node.js
RUN apk update && apk --update add nodejs npm && npm i -g pm2

# Install composer
COPY --from=composer/composer /usr/bin/composer /usr/local/bin/composer

FROM php-system-setup AS app-setup

# Set working directory
ENV LARAVEL_PATH=/srv/app
WORKDIR $LARAVEL_PATH

# Add non-root user: 'app'
ARG NON_ROOT_GROUP=${NON_ROOT_GROUP:-app}
ARG NON_ROOT_USER=${NON_ROOT_USER:-app}
RUN addgroup -S $NON_ROOT_GROUP && adduser -S $NON_ROOT_USER -G $NON_ROOT_GROUP
RUN addgroup $NON_ROOT_USER wheel

# Set cron job
COPY ./.deploy/config/crontab /etc/crontabs/$NON_ROOT_USER
RUN chmod 777 /usr/sbin/crond
RUN chown -R $NON_ROOT_USER:$NON_ROOT_GROUP /etc/crontabs/$NON_ROOT_USER && setcap cap_setgid=ep /usr/sbin/crond

# Switch to non-root 'app' user & install app dependencies
COPY composer.json composer.lock ./
RUN touch .env && echo APP_KEY= >> .env
RUN chown -R $NON_ROOT_USER:$NON_ROOT_GROUP $LARAVEL_PATH
USER $NON_ROOT_USER
RUN composer install --prefer-dist --no-scripts --no-dev --no-autoloader
RUN rm -rf /home/$NON_ROOT_USER/.composer

# Copy app
COPY --chown=$NON_ROOT_USER:$NON_ROOT_GROUP . $LARAVEL_PATH/
COPY ./.deploy/config/php/local.ini /usr/local/etc/php/conf.d/local.ini

# Set any ENVs
ARG APP_NAME=${APP_NAME}
ARG APP_URL=${APP_URL}
ARG ASSET_URL=${ASSET_URL}
ARG APP_ENV=${APP_ENV}
ARG APP_DEBUG=${APP_DEBUG}

ARG LOG_CHANNEL=${LOG_CHANNEL}

ARG DB_CONNECTION=${DB_CONNECTION}
ARG DB_HOST=${DB_HOST}
ARG DB_PORT=${DB_PORT}
ARG DB_DATABASE=${DB_DATABASE}
ARG DB_USERNAME=${DB_USERNAME}
ARG DB_PASSWORD=${DB_PASSWORD}

ARG BROADCAST_DRIVER=${BROADCAST_DRIVER}
ARG CACHE_DRIVER=${CACHE_DRIVER}
ARG QUEUE_CONNECTION=${QUEUE_CONNECTION}
ARG SESSION_DRIVER=${SESSION_DRIVER}
ARG SESSION_LIFETIME=${SESSION_LIFETIME}
ARG SESSION_DOMAIN=${SESSION_DOMAIN}
ARG SESSION_SECURE_COOKIE=${SESSION_SECURE_COOKIE}
ARG SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS}

ARG REDIS_HOST=${REDIS_HOST}
ARG REDIS_PASSWORD=${REDIS_PASSWORD}
ARG REDIS_PORT=${REDIS_PORT}

ARG MAIL_MAILER=${MAIL_MAILER}
ARG MAIL_HOST=${MAIL_HOST}
ARG MAIL_PORT=${MAIL_PORT}
ARG MAIL_USERNAME=${MAIL_USERNAME}
ARG MAIL_PASSWORD=${MAIL_PASSWORD}
ARG MAIL_ENCRYPTION=${MAIL_ENCRYPTION}
ARG MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}
ARG MAIL_ENCRYPTION=${MAIL_ENCRYPTION}
ARG MAIL_FROM_NAME=${APP_NAME}

ARG PUSHER_APP_ID=${PUSHER_APP_ID}
ARG PUSHER_APP_KEY=${PUSHER_APP_KEY}
ARG PUSHER_APP_SECRET=${PUSHER_APP_SECRET}
ARG PUSHER_APP_CLUSTER=${PUSHER_APP_CLUSTER}

ARG VITE_APP_NAME=${VITE_APP_NAME}
ARG VITE_OGP_TWITTER_SITE=${VITE_OGP_TWITTER_SITE}
ARG VITE_OGP_TWITTER_DOMAIN=${VITE_OGP_TWITTER_DOMAIN}

# Start app
EXPOSE 80
COPY ./.deploy/entrypoint.sh /

ENTRYPOINT ["sh", "/entrypoint.sh"]
```

たとえばPHPのバージョンを変えたい場合、CapRoverの管理画面のApp Configsでバージョンを指定します。

```
PHP_VERSION=8.0
```

### 3.3. entrypoint.shをつくる

このentrypoint.shはLaravelのデプロイコマンドをまとめたものです。本番用のデプロイコマンドなので`--force`のオプションなどを忘れないようにしましょう。本番環境だとmigrateは対話的に行われます。（yes押せないからデプロイがコケる）

entrypoint.sh
```
#!/bin/sh

composer dump-autoload --no-interaction --no-dev --optimize

npm install
npm run build

chmod -R 777 storage bootstrap/cache
php artisan key:generate
php artisan storage:link
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --no-interaction --force
php artisan db:seed --force

pm2 start bootstrap/ssr/ssr.js -n $APP_URL -i 1
supervisord -c $LARAVEL_PATH/.deploy/config/supervisor.conf
```

### 3.4. CLIでデプロイする

CapRoverにCLIでデプロイするためのコマンドツールを開発端末にインストールします。

```
npm install -g caprover
```

```
caprover -V
```

```
2.2.3
```
まずはログインします。

```
caprover login
```
質問されるので答えます。

1. CapRoverのURL(URLが`https://captain.some.com`なら`some.com`だけ入力)
2. パスワード
3. 任意のログインユーザを入力すると登録される

```
? CapRover machine URL address, it is "[http[s]://][captain.]your-captain-root.domain": (captain.captainroot.yourdomain.com)
? CapRover machine password: [input is hidden]
? CapRover machine name, with whom the login credentials are stored locally: (captain-01)
```

準備が整ったらプロジェクトのルートにて、以下のコマンドを実行します。

```
caprover deploy
```

質問されるので答えます。

1. CapRoverのマシン名
2. デプロイ先のアプリ名
3. デプロイするブランチ名
4. Yでデプロイ

```
? select the CapRover machine name you want to deploy to: (Use arrow keys)
? select the app name you want to deploy to: (Use arrow keys)
? git branch name to be deployed: (master)
? note that uncommitted and gitignored files (if any) will not be pushed to server! Are you sure you
 want to deploy? (Y/n)
```

しばらくするとデプロイが完了します。ログで確認することができます。

```
Building your source code...

------------------------- Mon Aug 14 2023 02:18:06 GMT+0000 (Coordinated Universal Time)
Build started for www
An explicit image name was provided (php:8.1-alpine3.17). Therefore, no build process is needed.
Pulling this image: php:8.1-alpine3.17 This process might take a few minutes.
Build has finished successfully!

Deployed successfully www
App is available at https://www.pandora.nohaco.com
```

イメージなど新しくpullするときは時間がかかります。完了したらデプロイ先のURLにアクセスしてみましょう。

[https://hello-inertia.pandora.nohaco.com](https://hello-inertia.pandora.nohaco.com){:target="_blank"}

## おわりに
CapRoverのサンプルアプリのバージョンが古かったり、情報が少なかったりと多々ハマりましたがデプロイできました。参考にさせてもらったサイトです。

[Heroku の代替 OSS を試した話](https://www.maeda-m.com/2022/12/03/advent-calendar.html){:taget="_blank"}
