---
title: DNS的秘密日记～从hosts开始的物语（上）
published: 2024-09-23
description: 从hosts酱到DNS君的故事～带你认识域名解析的基础原理，理解为什么修改hosts能直连
image: https://s3.yumeyuka.plus/2025/23-21-08.webp
tags: ["DNS", "hosts"]
category: 知识
draft: false
---

# hosts 是什么？

很久以前，互联网刚起步时，全世界的主机数量极少，域名解析完全依赖于每台设备本地的 `hosts` 文件。这份文件里记录了互联网上所有主机的域名和对应
IP 地址。当时并没有 DNS 服务器，大家只要从专门的维护站点下载最新的 `hosts` 文件，就能直接在本机通过它完成访问。想访问哪个域名，就翻开
`hosts` 文件，找到对应的 IP，连上就行了。

但随着互联网用户和服务器数量的爆炸式增长，所有人都去同一个地方拉 `hosts`
文件，文件体量越来越大、更新也越来越频繁，单是检索就耗费不少时间，根本难以支撑庞大且分布全球的网络。

当你打开 `hosts` 文件，会看到这样的记录：

Windows 路径：`C:\Windows\System32\drivers\etc\hosts`  
Linux 路径：`/etc/hosts`

```text
127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
20.205.243.166  github.com
61.91.161.217   www.google.com
61.91.161.217   google.com
61.91.161.217   gcr.io
…
```

最常见的第一行 `127.0.0.1 localhost`，就是把域名 `localhost` 直接映射到本机。第 5 行的内容告诉我们：访问 `github.com`
时，直接连到 `20.205.243.166`。一看 IP 在前、域名在后，就能瞬间明白 `hosts` 文件的作用了——把域名和 IP 直接绑在一起。

## DNS 是什么？

DNS（Domain Name System，域名系统）则是后来应运而生的一套分布式数据库，专门负责把人类更易记的域名（如 `www.example.com`
）转换为计算机能识别的 IP 地址（如 `192.0.2.1` 或 `2001:db8::1`）。可以把 DNS 想象成电话簿，名字是域名，电话号码则是 IP。

- 一条域名解析记录可以对应多个 IP，所以你在浏览器地址栏输入 `google.com` 或 `www.google.com` 都能访问同一个网站。
- 浏览器访问时会先加上 `https://`，但根本原因还是 DNS 把域名转成 IP。

不过，在中国大陆访问 Google 时，由于 GFW（防火长城）会检测到域名里含有“Google”这样的关键词，它会伪装成 DNS 服务器给你返回一个错误甚至恶意的
IP。因为 DNS 查询通常基于无连接、且不可靠的 UDP 协议，浏览器只会接受第一个格式正确的响应，后续正常响应就被丢弃了，于是就连不上了。这种现象叫
**DNS 缓存污染** 或 **DNS 投毒**。

> 参考：从修改 hosts 文件科学上网中理解 DNS（上）

## DNS 解析流程与多 IP 负载

当一个域名在其权威 DNS 记录中有多个 IP 时，Local DNS（LDNS）会把它们全部返回，并随机打乱顺序。浏览器通常默认选第一个 IP 去访问：

1. 浏览器向 LDNS 发起解析请求。
2. LDNS 递归查询上级 DNS 服务器，直到权威 DNS。
3. 权威 DNS 返回所有 IP，顺序随机。
4. 浏览器挑第一个 IP 连接，若无反向代理，每个 IP 被访问的机会大致相等。

### 修改 hosts 劫持解析

本地解析优先级：`hosts > DNS`。

- 当你在 `/etc/hosts` （或 Windows 的 `hosts`）中写入某条记录后，系统会直接使用本地的映射，完全绕过远程 DNS。
- 这也是为什么很多翻墙教程里教你修改 `hosts`，可以直接“直连” GitHub、Google 等被屏蔽的网站。

```bash
# 修改前，ping 到真实公网 IP
ping linuxido.com
# dig 查看到的也是 123.56.94.254

# 在 /etc/hosts 里追加
echo '120.120.120.120 linuxido.com' >> /etc/hosts

# 修改后，ping 走本地 hosts 指定的 IP
ping linuxido.com  # 会尝试连 120.120.120.120
```

但注意，`dig`、`host`、`nslookup` 等工具在默认查询时还是会去 DNS 服务器（如 8.8.8.8）抓记录，不走 hosts，所以它们依然会返回真实的公网
IP。

### DNS 劫持与污染

真正的 DNS 劫持是指攻击者或中间人伪造 DNS 响应，把域名指向恶意 IP；**DNS 缓存污染**（DNS cache pollution）便是中毒后的 DNS
服务器缓存了错误的记录，导致所有下游用户都被“毒害”。

防范方法包括：

- 使用可信的 DNS-over-HTTPS（DoH）或 DNS-over-TLS（DoT）服务；
- 开启 DNSSEC 验证，确保收到的响应带有数字签名且未被篡改。

## 用 hosts 实现科学上网

以 GitHub 为例：

```text
20.205.243.166  github.com
```

当你修改 hosts，把 `github.com` 指向官方最快 IP，系统就不再走中国大陆的 DNS，而是直接根据本地映射去连接，这样就能“直连”GitHub。不过单靠
hosts 有时也不够流畅，通常还会配合 FastGithub 等加速工具一起使用。