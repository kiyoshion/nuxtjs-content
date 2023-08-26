---
title: 'usePage'
shortTitle: 'usePage'
tag: 'Inertia'
category: ''
---

pages配下以外のコンポーネントでshared dataを使いたい場合はusePage()を使う。

```
import { usePage } from "@inertiajs/react";

export default function Navbar() {
  const { auth } = usePage().props
  ...
```

[https://inertiajs.com/shared-data](https://inertiajs.com/shared-data){:target="_blank"}
