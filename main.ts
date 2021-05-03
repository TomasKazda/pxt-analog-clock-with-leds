interval.OnInterval(999, function () {
    if (running && !busy) {
        let tmp = ++pulseStack
        pulseStack = 0
        setPulse(tmp)
    } 
    else if (running && busy) {
        pulseStack++
    } 
    else if (pulseStack > 0)
    {
        let tmp = pulseStack
        pulseStack = 0
        setPulse(tmp)
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    reset()
})
input.onButtonPressed(Button.A, function () {
    if (!busy) {
        pulseStack += 30
        let tmp = pulseStack
        pulseStack = 0
        setPulse(tmp)
    }
})
input.onButtonPressed(Button.B, function () {
    if (!busy) running = !(running)
})
pins.onPulsed(DigitalPin.P8, PulseValue.High, function () {
    // serial.writeValue("time", control.millis())
    if (!(running) && !busy) {
        pulseStack++
    }

    //hand calibration
    if (running) {
        let delta = tick % 60
        //serial.writeValue("div", delta)
        busy = true
        if (delta == 0) magicbit.StepperDegree(magicbit.Steppers.STPM1, 3.2)
        else if (delta == 58) magicbit.StepperDegree(magicbit.Steppers.STPM1, -3.2)
        else if (delta > 0 && delta < 30) magicbit.StepperDegree(magicbit.Steppers.STPM1, 5.8 * delta)
        else if (delta < 58) magicbit.StepperDegree(magicbit.Steppers.STPM1, -5.8 * (58 - delta))
        busy = false
    }
})
function setPulse (pulses: number) {
    tick += pulses

    let steps = pulses % 60;
    if (steps > 0) 
    {
        busy = true
        let angle = 0;
        if (steps < 6) {
            tick -= steps
            for (let i = 0; i < steps; i++)
            {
                tick++
                if (tick % 4 == 0)
                {
                    angle += 5.7;
                }
                else
                {
                    angle += 6.45;
                }
            }
        } else {
            angle = steps * 5.8
        }
        minsLED.showBarGraph(tick % 60, 59)
        hoursLED.showBarGraph(tick % 720, 719)
        //serial.writeValue("angle", angle)
        magicbit.StepperDegree(magicbit.Steppers.STPM1, angle)
        busy = false
    }

    if (tick == 720) {
        tick = 0
    }
    led.plotBarGraph(tick, 720)
}

function reset () {
    busy = true
    running = false
    tick = 0
    minsLED.showBarGraph(tick % 60, 59)
    hoursLED.showBarGraph(tick % 720, 719)
    minsLED.setBrightness(32)
    hoursLED.setBrightness(32)
    led.plotBarGraph(tick, 720)
    if (pins.digitalReadPin(DigitalPin.P8) != 0)
    {
        do
        {
            magicbit.StepperDegree(magicbit.Steppers.STPM1, 2.2)
            basic.pause(25)
        } while (pins.digitalReadPin(DigitalPin.P8) != 0)
        magicbit.StepperDegree(magicbit.Steppers.STPM1, 3)
    }
    busy = false
}
let tick = 0
let pulseStack = 0
let running = false
let busy = false
let minsLED: neopixel.Strip = null
let hoursLED: neopixel.Strip = null
hoursLED = neopixel.create(DigitalPin.P14, 24, NeoPixelMode.RGB)
minsLED = neopixel.create(DigitalPin.P15, 60, NeoPixelMode.RGB)
pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
basic.pause(1000)
reset()
basic.forever(function () {
	
})
