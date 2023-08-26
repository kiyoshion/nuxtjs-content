---
title: 'Remove'
shortTitle: 'Remove'
tag: 'Docker'
category: ''
---

## Remove container

1. Show lists of containers

```
docker ps -a
```

2. Remove container

```
docker rm ID
```

OR you can also

```
docker rm c64a31891e27 6d954ed8377a 44d2f194a6b2
```

## Remove image

1. Show lists of images

```
docker images
```

2. Remove image

```
docker rmi ID
```

### Remove container and image

```
docker rmi -f ID
```

OR you can also

```
docker rmi -f 953d1ef48bcc 7d6f36a32c02 f8f3ec83b422
```
