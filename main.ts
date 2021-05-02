interval.OnInterval(999, function () {
    if (running) {
        setPulse(1)
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    reset()
})
input.onButtonPressed(Button.A, function () {
    setPulse(60)
})
input.onButtonPressed(Button.B, function () {
    running = !(running)
})
pins.onPulsed(DigitalPin.P8, PulseValue.High, function () {
    // serial.writeValue("time", control.millis())
    if (!(running) && !reseting) {
        setPulse(1)
    }

    //hand calibration
    if (running) {
        let delta = tick % 60
        // if (delta != 59)
        // {
        //     if (delta == 0) magicbit.StepperDegree(magicbit.Steppers.STPM1, 2.9)
        //     else if (delta < 5) magicbit.StepperDegree(magicbit.Steppers.STPM1, -5.8 * (delta + 1))
        //     else if (delta < 59) magicbit.StepperDegree(magicbit.Steppers.STPM1, 5.8)
        // }
        serial.writeValue("div", delta)
    }
})
function setPulse (pulses: number) {
    tick += pulses
    // for (let i = 0; i < pulses; i++) {
    // if (++tick % 30 === 0)
    // {
    // hoursLED.rotate()
    // }
    // minsLED.rotate()
    // }
    // hoursLED.show()
    // minsLED.show()
    if (tick % 4 == 0)
        magicbit.StepperDegree(magicbit.Steppers.STPM1, 5.8)
    else
        magicbit.StepperDegree(magicbit.Steppers.STPM1, 6.55)

    minsLED.showBarGraph(tick % 60, 59)
    hoursLED.showBarGraph(tick % 720, 719)
    if (tick == 720) {
        tick = 0
    }
    led.plotBarGraph(
    tick,
    720
    )
}

function reset () {
    reseting = true
    running = false
    tick = 0
    minsLED.showBarGraph(tick % 60, 59)
    hoursLED.showBarGraph(tick % 720, 719)
    minsLED.setBrightness(32)
    hoursLED.setBrightness(32)
    // hoursLED.setPixelColor(0, neopixel.rgb(0, 0, 16))
    // minsLED.setPixelColor(0, neopixel.rgb(0, 16, 0))
    // minsLED.show()
    // hoursLED.show()
    led.plotBarGraph(
    tick,
    720
    )
    if (pins.digitalReadPin(DigitalPin.P8) != 0)
    {
        do
        {
            magicbit.StepperDegree(magicbit.Steppers.STPM1, 2.2)
            basic.pause(25)
        } while (pins.digitalReadPin(DigitalPin.P8) != 0)
        magicbit.StepperDegree(magicbit.Steppers.STPM1, 3)
    }
    reseting = false
}
let tick = 0
let running = false
let reseting = false
let minsLED: neopixel.Strip = null
let hoursLED: neopixel.Strip = null
hoursLED = neopixel.create(DigitalPin.P14, 24, NeoPixelMode.RGB)
minsLED = neopixel.create(DigitalPin.P15, 60, NeoPixelMode.RGB)
pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
reset()
basic.forever(function () {
	
})
