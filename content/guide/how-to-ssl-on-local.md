---
title: 'ローカル環境をSSL化する'
tags: ['ssl']
type: 'PaaS'
icon: 'Laravel'
---

## ローカル環境をSSL化する

for Mac

```
brew install mkcert nss
```

```
mkcert -install
```

```
mkcert -CAROOT
```

```
mkcert localhost
```

```
mkcert mylocalhost.com
```
