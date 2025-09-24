---
title: 网易云降噪小魔法
published: 2025-07-07
description: "可恶的网易云！明明只是想安静听歌，结果还要跟压制模块斗智斗勇(>_<)"
image: "https://s3.yumeyuka.plus/2025/1758683230892.webp"
tags: [ "网易云","Music" ]
category: 知识
draft: false
---



本来一个月前就该发出来的，最近突然想起来还没发出来，
这一版相比之前没什么区别，还是建议更新到此版本，上版是 `CPP` 写的，这一版用 `kotlin native` 重写了,逻辑上没有变化，还是监听前台进程然后kill
掉多余的不需要的服务

国内的毒瘤 APP 都太多了，点名网易云最为代表，听歌 APP 什么都有，本来性能就很差，还要在后台留一堆不需要的服务，太坏了

> [!NOTE]
>
> 非常 素晴らしい

| `编写语言` |    kotlin    |
|--------|:------------:|
| `压制效果` | 中等，不知道网易云太坏了 |
| `bug`  |     几乎没有     |
| `评价`   | 能用，但不多，治标不治本 |

**下载链接**：[Yume-Yunyun.zip](https://yumeyuka.plus/zip/Yume-Yunyun.zip)

## 示例伪代码

```c++
#include "head.hpp"

main() 
    Logger::Create(INFO, "/sdcard/Android/Yume-Yunyun/server.log")
    start_thread(clearLog).detach()

    cloudMusicPackage = "com.netease.cloudmusic"
    playProcess = "com.netease.cloudmusic:play"
    CHECK_INTERVAL = 30

    Logger::Info("服务已启动，监控网易云音乐进程")

    while (true)
        if (!isAppRunning(cloudMusicPackage))
            sleep(CHECK_INTERVAL)
            continue

        currentAppName = getCurrentAppName()
        Logger::Info("当前前台应用: " + currentAppName)

        if (currentAppName 不包含 cloudMusicPackage)
            processes = getAppProcessesAndPIDs(cloudMusicPackage)
            Logger::Info("网易云不在前台，找到进程数：" + processes.size())

            if (processes 为空)
                Logger::Info("没有找到进程，等待下一次检查")
            else
                for each process in processes
                    if (process.name 包含 playProcess)
                        Logger::Info("保留播放进程: " + process.name + ", PID: " + process.pid)
                    else
                        Logger::Info("终止进程: " + process.name + ", PID: " + process.pid)
                        killProcess(process.pid)
        else
            Logger::Info("网易云音乐在前台，不做操作")
        
        sleep(CHECK_INTERVAL)

```

xxxxxxxxxx // 动态显示数码管void DisplaySMG_Dynamic() {  SelectBit(0);  SelectSegment(SMG_NoDot[hour / 10]);  DelaySMG(500);​  SelectBit(1);  SelectSegment(SMG_NoDot[hour % 10]);  DelaySMG(500);​  SelectBit(2);  SelectSegment(SMG_NoDot[16]);  DelaySMG(500);​  SelectBit(3);  SelectSegment(SMG_NoDot[minute / 10]);  DelaySMG(500);​  SelectBit(4);  SelectSegment(SMG_NoDot[minute % 10]);  DelaySMG(500);​  SelectBit(5);  SelectSegment(SMG_NoDot[16]);  DelaySMG(500);​  SelectBit(6);  SelectSegment(SMG_NoDot[second / 10]);  DelaySMG(500);​  SelectBit(7);  SelectSegment(SMG_NoDot[second % 10]);  DelaySMG(500);}​c

Kt Native 编译出来的目标 ELF 大小上和 C++ 差距不大,但是运行时内存占用可谓是天差地别 ,差了近 10 倍 的内存占用 ,当然 Kt
Native 会自动 GC 回收内存, 以本模块为例,大概 刚运行时为 50M 一段时间之后 GC 会到25M ,差不多回收了 1/2 但是和 C++
编译出来还是差距很大



> [!TIP]
>
> Kt Native MacOS 和 IOS 为大致为第一梯队 , Linux 差不多为第二梯队, Android 和Windows差不多就是第三梯队了

![23-21-09.webp](https://s3.yumeyuka.plus/2025/23-21-09.webp)