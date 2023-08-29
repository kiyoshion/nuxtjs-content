---
title: 'usePage'
shortTitle: 'usePage'
tag: 'Inertia'
category: ''
---

pages配下以外のコンポーネントで`shared data`を使いたい場合はusePage()を使う。

```
import { usePage } from "@inertiajs/react";

export default function Navbar() {
  const { auth } = usePage().props
  ...
```

pages配下以下のコンポーネントはデフォルトでpropsに`shared data`が入っている。

```
export default function IndexPage(props) {
  const { auth } = props
}
```

[https://inertiajs.com/shared-data](https://inertiajs.com/shared-data){:target="_blank"}
