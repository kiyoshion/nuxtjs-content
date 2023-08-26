---
title: 'CapRoverでアプリをデプロイする'
tags: ['VPS', 'PaaS', 'CapRover']
type: 'PaaS'
icon: 'Next.js'
---

## CapRoverにアプリする

まずはルートドメインにReactでSSGサイトをデプロイした手順を解説していきます。

### 【注意】Force HTTPS by readirecting all HTTP traffic to HTTPS
HTTPからのアクセスをHTTPSにリダイレクトしたいのはいつもとおりだと思います。「Enable HTTPS」ボタンを先に押してから「「Force HTTPS by readirecting all HTTP traffic to HTTPS」」にチェックを入れてもリダイレクトされません。先に「Force HTTPS by readirecting all HTTP traffic to HTTPS」にチェックを入れて、そのあとに「Enable HTTPS」のボタンを押しましょう。

## アプリをデプロイする前に
Captain Definitionファイルが必要。プロジェクトのルートにcaptaion-definitionファイルをつくる。以下はdocker hubから Nginxのイメージを使う例。

```
{
  "schemaVersion": 2,
  "imageName": "nginx:stable-alpine3.17-slim"
}
```

[https://hub.docker.com/layers/library/nginx/stable-alpine3.17-slim/images/sha256-785ed82af07602663e62d36f462b1f9a212f0587de8737189fff9f258801d7c0?context=explore](https://hub.docker.com/layers/library/nginx/stable-alpine3.17-slim/images/sha256-785ed82af07602663e62d36f462b1f9a212f0587de8737189fff9f258801d7c0?context=explore){:target=”_blank”}

## CapRoverにアプリをデプロイする6つの方法

### CLI

プロジェクトのルートにて以下のコマンドを実行する。

```
caprover deploy
```

```
? select the CapRover machine name you want to deploy to: (Use arrow keys)
? select the app name you want to deploy to: (Use arrow keys)
? git branch name to be deployed: (master)
? note that uncommitted and gitignored files (if any) will not be pushed to server! Are you sure you
 want to deploy? (Y/n)
```

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


```
Building your source code...

------------------------- Mon Aug 14 2023 02:05:50 GMT+0000 (Coordinated Universal Time)
Build started for www
An explicit image name was provided (nginx:stable-alpine3.17-slim). Therefore, no build process is needed.
Pulling this image: nginx:stable-alpine3.17-slim This process might take a few minutes.
Build has finished successfully!

Deployed successfully www
App is available at https://www.pandora.nohaco.com
```

### Tarball
管理画面から.tarファイルをドロップアンドドロップする。

### GitHubにgit push

### Dockerfile/DockerImage/DockerCompose

CapRoverのOne-Click Appsでは部分的にdocker composeをサポートしています。

>Specifically, it only supports: image, environment, ports, volumes, depends_on, and hostname, other parameters are currently being ignored by CapRover.

使えるパラメータはimage, environment, ports, volumes, depends_on, hostnameだけ。Dockerfileからbuitしようとしても無視されます。そのための代替案が提示されています。

>If you can't make it work with a one click app template, there is another option! You can simply run pure docker compose by download the compose file and run docker compose up. But before that just add captain-overlay-network to your web application section of your docker compose yaml file:
>```
>web-app:
>    image: .....
>    container_name: ......
>    networks:
>      - captain-overlay-network
>
>networks:
>  captain-overlay-network:
>    external: true
>```

ざっくり訳すと直接docker composeをダウンロードして、networksにはcaptain-overlay-networkを追記してねとのこと。結構面倒だけど、ピュアなdocker composeを使いたいのでこちらでデプロイしてみます。

docker-composeを使ってアプリをデプロイしてみます。ざっくりというとdocker-compose.ymlの内容をOne-click appsのテンプレートにコピペします。

1. Navigate to Apps
2. Click on "One Click Apps/Databases"
3. Navigate to the very bottom of the list, and click on the last item, called >> TEMPLATE <<
4. Copy the following section to the box:
5. After ########, copy the entire content of your Docker Compose. Keep in mind that your services will get prefixed with srv-captain-- when deployed via CapRover. Hence make changes if needed. For example, the complete wordpress docker compose will look like this in CapRover

```
captainVersion: 4
caproverOneClickApp:
  instructions:
    start: Just a plain Docker Compose.
    end: Docker Compose is deployed.
########
```

```
captainVersion: 4
caproverOneClickApp:
  instructions:
    start: Just a plain Docker Compose.
    end: Docker Compose is deployed.
########
version: '3.3'

services:
  db:
    image: mysql:5.7
    volumes:
      - db-data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: srv-captain--db:3306 ## NOTICE it is changed to "srv-captain--db" from "db"
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
volumes:
  db-data: {}
```


[https://caprover.com/docs/docker-compose.html#how-to-run-docker-compose-on-caprover](https://caprover.com/docs/docker-compose.html#how-to-run-docker-compose-on-caprover){:target="_blank"}
