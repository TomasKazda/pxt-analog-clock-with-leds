input.onButtonPressed(Button.A, function() {
    setPulse(60)
})

input.onButtonPressed(Button.B, function() {
    setPulse(1)
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function() {
    reset()
})
pins.onPulsed(DigitalPin.P8, PulseValue.High, function () {
    //serial.writeValue("time", control.millis())
    setPulse(1)
})

function setPulse(pulses: number):void {
    tick += pulses
    // for (let i = 0; i < pulses; i++) {
    //     if (++tick % 30 === 0)
    //     {
    //         hoursLED.rotate()
    //     }
    //     minsLED.rotate()
    // }
    // hoursLED.show()
    // minsLED.show()
    minsLED.showBarGraph(tick%60, 59)
    hoursLED.showBarGraph(tick%720, 719)
    if (tick === 720) tick = 0
    led.plotBarGraph(tick, 720);
}

function reset():void {
    tick = 0
    minsLED.showBarGraph(tick%60, 59)
    hoursLED.showBarGraph(tick%720, 719)
    minsLED.setBrightness(32)
    hoursLED.setBrightness(32)
    //hoursLED.setPixelColor(0, neopixel.rgb(0, 0, 16))
    //minsLED.setPixelColor(0, neopixel.rgb(0, 16, 0))
    //minsLED.show()
    //hoursLED.show()
    led.plotBarGraph(tick, 720);
}

let tick: number = 0
let hoursLED: neopixel.Strip = null
let minsLED: neopixel.Strip = null
hoursLED = neopixel.create(DigitalPin.P14, 24, NeoPixelMode.RGB)
minsLED = neopixel.create(DigitalPin.P15, 60, NeoPixelMode.RGB)
pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
reset()

basic.forever(function () {
	
})
