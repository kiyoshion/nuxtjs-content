---
title: "Mixed Content"
shortTitle: "Mixed Content"
tags: ['Laravel']
category: 'laravel'
---

Mixed Content: The page at 'https://xxx.com'' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://xxx.com'. This request has been blocked; the content must be served over HTTPS.

Add below in head.

```
<head>
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</head>
```

[https://stackoverflow.com/a/75357483/11548885](https://stackoverflow.com/a/75357483/11548885){:target="_blank"}
