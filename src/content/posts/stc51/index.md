---
title: IAP15F2K60S2 单片机
published: 2024-11-13
description: "Microcontroller."
image: "./1751824445917.webp"
tags: ["STC51","IAP15F2K60S2"]
category: Microcontroller
draft: false
---

### 数码管显示的一些使用的操作

晶体数码管按公共端极性可分为共阴极和共阳极两种。由于每次只能点亮一位，要实现多位同时显示，就必须配合锁存器以及段选、位选电路，采用动态扫描的方式。动态扫描利用人眼的视觉滞留效应，通过高速轮询各位并依次点亮，让多位数码管看起来像是同时显示。但如果刷新速度过快，切换瞬间会产生残影；速度过慢，又会出现闪烁。因此，在位选与段选切换处需加入适当的消抖延时，既能消除重影，又保证显示稳定。无论共阴极还是共阳极，原理相同，都是通过合理控制每个位的点亮时间和刷新频率，实现清晰、流畅的动态显示。


### 环境配置

1. 下载安装Clion

2. 安装 PlatformIO 插件

3. 在clion中新建一个项目，根据提示配置环境

4. 编写一个简单的代码测试环境是否配置成功

```c
#include <mcs51/8052.h>

void main()

{
    while(1)
    {
        P1 = 0xfe;
    }
}
```

### 环境配置文件(以stc89c52rc为例)

```json
[env:STC89C52RC]
platform = intel_mcs51
board = STC89C52RC

lib_deps = C:\Users\Night\.platformio\packages\toolchain-sdcc\include 
// 这里配置环境安装路径
```


## 定时器函数

```c
// Timer 0 interrupt service routine
void timer0_ISR() __interrupt(1) {
    TH0 = 0xFC; // Reload high byte for 1ms
    TL0 = 0x66; // Reload low byte for 1ms
    }
}

// Initialize Timer 0
void Timer0_Init() {
    TMOD |= 0x01; // Set Timer 0 in mode 1 (16-bit timer mode)
    TH0 = 0xFC;   // Load initial value for 1ms delay
    TL0 = 0x66;
    ET0 = 1;      // Enable Timer 0 interrupt
    EA = 1;       // Enable global interrupts
    TR0 = 1;      // Start Timer 0
}
```
## 数码管位选和段选
    
 ```c
// 选择位
void SelectBit(unsigned char pos) {
  Init74HC138(6); // Open COM end
  P0 = 0x00;      // Turn off all segments
  DelaySMG(10);   // Short delay to eliminate shadow
  P0 = (0x01 << pos);
}

// 选择段
void SelectSegment(unsigned char value) {
  Init74HC138(7); // 打开段选端
  P0 = value;
}

```

## 74HC573锁存器

```c
void int74h573(unsigned int n) {
  switch (n) {
  case 4:
    P2 = (P2 & 0x1f) | 0x80;
    break;
  case 5:
    P2 = (P2 & 0x1f) | 0xa0;
    break;
  case 6:
    P2 = (P2 & 0x1f) | 0xc0;
    break;
  case 7:
    P2 = (P2 & 0x1f) | 0xe0;
    break;
  }
}

```

##  动态显示数码管
```c
// 动态显示数码管
void DisplaySMG_Dynamic() {
  SelectBit(0);
  SelectSegment(SMG_NoDot[hour / 10]);
  DelaySMG(500);

  SelectBit(1);
  SelectSegment(SMG_NoDot[hour % 10]);
  DelaySMG(500);

  SelectBit(2);
  SelectSegment(SMG_NoDot[16]);
  DelaySMG(500);

  SelectBit(3);
  SelectSegment(SMG_NoDot[minute / 10]);
  DelaySMG(500);

  SelectBit(4);
  SelectSegment(SMG_NoDot[minute % 10]);
  DelaySMG(500);

  SelectBit(5);
  SelectSegment(SMG_NoDot[16]);
  DelaySMG(500);

  SelectBit(6);
  SelectSegment(SMG_NoDot[second / 10]);
  DelaySMG(500);

  SelectBit(7);
  SelectSegment(SMG_NoDot[second % 10]);
  DelaySMG(500);
}

```