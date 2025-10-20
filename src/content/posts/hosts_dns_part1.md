---
title: DNS的秘密日记～从hosts开始的物语
published: 2024-09-26  
description: "从最初的HOSTS.TXT到如今庞大的DNS体系，这篇小日记记录了域名解析的发展历程"  
image: "https://s3.yumeyuka.plus/2025/23-21-08.webp"  
tags: ["DNS", "hosts"]  
category: 知识  
draft: false
---

## hosts 是什么？

在互联网刚起步的年代，主机数量极少，域名解析完全依赖本地的 `hosts` 文件。这份集中维护的文本记录了域名与 IP 的对应关系。用户通过下载最新的
`hosts` 文件，就能在本机直接完成访问。

当你打开 `hosts` 文件，会看到如下路径和示例内容：

**Windows 路径：**

```text
C:\Windows\System32\drivers\etc\hosts
```

Linux 路径：

```text
/etc/hosts
```

示例：

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

- 第一行 `127.0.0.1 localhost` 表示把域名 `localhost` 映射到本机。
- 第 5 行告诉我们：访问 `github.com` 时直接连到 `20.205.243.166`。
- 从 IP 在前、域名在后即可看出：`hosts` 文件的作用就是将二者绑定。

随着互联网规模快速膨胀，单一文件的检索与分发成本激增，无法满足全球网络对实时性和可扩展性的需求。

## DNS 是什么？

DNS（Domain Name System，域名系统）是一套分布式数据库，负责将人类易记的域名（如 `www.example.com`）转换为计算机识别的 IP 地址（如
`192.0.2.1` 或 `2001:db8::1`），可视作互联网的“电话簿”。

- 一条域名解析记录可以对应多个 IP，浏览器输入 `google.com` 与 `www.google.com` 都能访问同一网站。
- 浏览器访问时通常会在前面自动添加 `https://`，但根本依赖仍是 DNS 将域名解析为 IP。
- 在中国大陆访问 Google 时，GFW（防火长城）会拦截含“google”关键词的 DNS 查询，伪装成 DNS 服务器返回错误或恶意
  IP，导致正常响应被丢弃，这种现象称为 **DNS 缓存污染** 或 **DNS 投毒**。

> 参考：从修改 hosts 文件科学上网中理解 DNS（上）

## DNS 解析流程与多 IP 负载均衡

当某域名在权威 DNS 记录中存在多个 IP 时，Local DNS（LDNS）会返回所有 IP 并随机打乱顺序。浏览器通常选择第一个 IP 发起连接，使各
IP 获得近似均衡的访问机会。

1. 浏览器向 LDNS 发起解析请求。
2. LDNS 递归查询上级 DNS 服务器，直至权威 DNS。
3. 权威 DNS 返回所有 IP，顺序随机。
4. 浏览器挑第一个 IP 连接，若无反向代理，多个 IP 访问几率相当。

### 本地 hosts 劫持解析

系统默认在本地解析前先检查 `hosts`：

- 当在 `/etc/hosts`（或 Windows 的 `hosts`）中写入记录后，系统会优先使用本地映射，绕过远程 DNS。
- 许多翻墙教程利用此机制，将 GitHub、Google 等域名指向官方快 IP，实现“直连”。

```bash
# 修改前，ping 到真实公网 IP
ping linuxido.com
# dig 默认查询 DNS 服务器，仍返回真实 IP

# 在 /etc/hosts 中追加
echo '120.120.120.120 linuxido.com' >> /etc/hosts

# 修改后，ping 使用本地 hosts 指定的 IP
ping linuxido.com  # 会尝试连 120.120.120.120
```

> 注意：`dig`、`host`、`nslookup` 等工具默认查询远程 DNS，不走 `hosts`，因此仍会返回真实公网 IP。

### DNS 劫持与污染

真正的 DNS 劫持指攻击者或中间人伪造 DNS 响应，将域名指向恶意 IP；**DNS 缓存污染**则是 DNS 服务器缓存了错误记录，影响所有下游用户。

防范方法包括：

- 使用可信的 *DNS-over-HTTPS*（DoH）或 *DNS-over-TLS*（DoT）服务；
- 开启 DNSSEC 验证，确保收到的响应具有数字签名且未被篡改；
- 部署 QNAME Minimizaton，减少 DNS 查询中的信息泄露；
- 定期清理本地和服务器端 DNS 缓存，降低中毒风险。

## 用 hosts 实现科学上网

以 GitHub 为例：

```text
20.205.243.166  github.com
```

将 `github.com` 指向官方最快 IP，系统便跳过中国大陆的 DNS，直接根据本地映射连接。为获得更稳定体验，往往还会配合 FastGithub
等加速工具使用。

## 域名解析系统的发展历程

随着互联网从实验性网络演进为全球信息基础设施，DNS 也在不断演进，以满足规模、性能与安全的需求。以下梳理其关键发展节点：

### 一、主机文件时代：HOSTS.TXT（1980 年代初）

- 在 DNS 出现前，所有域名解析依赖一份集中维护的 `HOSTS.TXT` 文本文件。
- 由斯坦福研究所（SRI）网络信息中心（NIC）负责更新，每台主机定期下载并手动更新文件。
- 随着联网设备激增，`HOSTS.TXT` 体量与分发成本迅速增长，系统效率与可扩展性难以为继。

### 二、DNS 系统的诞生与层级化设计（1983 年）

Paul Mockapetris 于 1983 年在 RFC 882、RFC 883 中首次提出 DNS 概念，后在 RFC 1034、RFC 1035 中完善协议。

- **分布式架构**：将域名空间拆分为多个子区，由不同服务器负责；
- **层级化命名**：域名以“.”分隔，从根（Root）到顶级域（TLD）、二级、三级域名，逐级查询并缓存。

#### 通用顶级域名（gTLD）

- .com：商业实体与企业；
- .org：非营利组织与公益机构；
- .net：网络服务提供商及互联网基础设施；
- .edu：经认证的教育机构；
- .gov/.mil：美国政府与军事部门保留。

#### 国家和地区顶级域名（ccTLD）

- 基于 ISO 3166-1 alpha-2 两字母代码，如 .cn（中国）、.uk（英国）。

### 三、根域名服务器的全球部署

最初的根服务器仅部署在美国。为降低查询延迟、提升容灾能力，13 个逻辑根服务器实例通过 Anycast 技术扩展至全球多个节点，由不同组织共同管理。

#### 为什么根服务器逻辑上只有 13 个？

- DNS 查询默认使用 UDP，报文最大长度 512 字节；
- 根提示文件需在此限制内列出所有根服务器 IP；
- 13 个 IPv4 地址（另含 IPv6 扩展）恰能兼顾完整性与报文大小。

为了支持中文、阿拉伯文、韩文等非拉丁字符，国际化域名（IDN）在 2000 年代提出，采用 Punycode 将 Unicode 字符映射为
ASCII，实现多语言域名互访。

### 四、现代安全与性能优化（21 世纪）

- **DNSSEC**：引入数字签名，验证 DNS 数据完整性与来源；
- **EDNS0**：允许更大 UDP 包载荷，支持扩展功能；
- **Anycast**：根服务器与公共 DNS 服务采用 Anycast，提高可用性和访问速度；
- *DNS-over-TLS*（DoT）与 *DNS-over-HTTPS*（DoH）：加密传输，防止中间人监听与篡改；
- **DNS over QUIC**（DoQ）：基于 QUIC 协议的加密解析，兼顾性能与隐私；
- **QNAME Minimization**：最小化查询名称，降低隐私泄露风险；
- **CDN 与地理位置解析**：通过 DNS 将用户请求引导至就近节点，提升访问速度和稳定性。
