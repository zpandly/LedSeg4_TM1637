//% weight=5 color=#2699BF icon="\uf080"
namespace LedSeg4 {
    let dispSeg: number[] = [
        0x3F,/*0*/
        0x06,/*1*/
        0x5B,/*2*/
        0x4F,/*3*/
        0x66,/*4*/
        0x6D,/*5*/
        0x7D,/*6*/
        0x07,/*7*/
        0x7F,/*8*/
        0x6F,/*9*/
        0x77,/*10 A*/
        0x7C,/*11 b*/
        0x58,/*12 c*/
        0x5E,/*13 d*/
        0x79,/*14 E*/
        0x71,/*15 F*/
        0x76,/*16 H*/
        0x38,/*17 L*/
        0x54,/*18 n*/
        0x73,/*19 P*/
        0x3E,/*20 U*/
        0x00,/*21 黑屏*/
    ];
    
    function TM1637_Start() {
        pins.digitalWritePin(DigitalPin.P1, 1);//SCL_1();
        pins.digitalWritePin(DigitalPin.P0, 1);//SDA_1();
        pins.digitalWritePin(DigitalPin.P0, 0);//SDA_0();  
    }

    function TM1637_Ack() {
        pins.digitalWritePin(DigitalPin.P1, 0);//SCL_0();
        for (let i=0; i<2000; i++) {
            if (pins.digitalReadPin(DigitalPin.P0) == 1)
                break;
        }
        //uint8_t br = GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_5);
        //while (br == 1 && (i < 2000)) i++;
        pins.digitalWritePin(DigitalPin.P1, 1);//SCL_1();
        pins.digitalWritePin(DigitalPin.P1, 0);//SCL_0();
    }

    function TM1637_Stop() {
        pins.digitalWritePin(DigitalPin.P1, 0);//SCL_0();
        pins.digitalWritePin(DigitalPin.P0, 0);//SDA_0();
        pins.digitalWritePin(DigitalPin.P1, 1);//SCL_1();
        pins.digitalWritePin(DigitalPin.P0, 1);//SDA_1();
    }

    function TM1637_Write(data:number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(DigitalPin.P1, 0);//SCL_0();
            if (data & 0x01)
                pins.digitalWritePin(DigitalPin.P0, 1);//SDA_1();
            else
                pins.digitalWritePin(DigitalPin.P0, 0);//SDA_0();
            data = data >> 1;
            pins.digitalWritePin(DigitalPin.P1, 1);//SCL_1();
        }  
    }
    
    //% block="Display Time|a %a|b %b|c %c|d %d|h %h"
    export function TM1637_Display(a:number, b:number, c:number, d:number, h:number) {
        TM1637_Start();
        TM1637_Write(0x40);//写数据+自动地址加1+普通模式
        TM1637_Ack();
        TM1637_Stop();
        TM1637_Start();
        TM1637_Write(0xc0);//设置显示首地址即第一个LED
        TM1637_Ack();

        TM1637_Write(dispSeg[a]);
        TM1637_Ack();
        TM1637_Write(dispSeg[b] | h << 7);//h为1时显示时钟中间的两点
        TM1637_Ack();
        TM1637_Write(dispSeg[c]);
        TM1637_Ack();
        TM1637_Write(dispSeg[d]);
        TM1637_Ack();

        TM1637_Stop();
        TM1637_Start();
        TM1637_Write(0x8b);//开显示，2/16亮度
        TM1637_Ack();
        TM1637_Stop();
    }
}