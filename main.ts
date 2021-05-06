interval.OnInterval(999, function () {
    if (running && !busy) {
        setPulse(1)
    } 
    else if (running && busy) {
        pulseStack++
    } 
    else if (pulseStack > 0)
    {
        setPulse(0)
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    reset()
})
input.onButtonPressed(Button.A, function () {
    if (!busy) {
        setPulse(30)
    }
})
input.onButtonPressed(Button.B, function () {
    if (!busy) running = !(running)
})
input.onButtonPressed(Button.AB, function () {
    if (minsLEDrange === 60)
    {
        hoursLEDrange = 43200
        minsLEDrange = 3600
        setClock()
    } else {
        hoursLEDrange = 720
        minsLEDrange = 60
        reset()
    }
})
pins.onPulsed(DigitalPin.P8, PulseValue.High, function () {
    if (control.eventTimestamp() < 500) return //remove oscilation
    // serial.writeValue("time", control.millis())
    // if (!(running) && !busy) {
    //     pulseStack++
    // }

    //hand calibration
    if (running) {
        let delta = tick % 60

        busy = true
        if (delta == 0) magicbit.StepperDegree(magicbit.Steppers.STPM1, 3.2)
        else if (delta == 58) magicbit.StepperDegree(magicbit.Steppers.STPM1, -6)
        else if (delta > 0 && delta < 30) magicbit.StepperDegree(magicbit.Steppers.STPM1, 5.8 * delta + 3.2)
        else if (delta < 58) magicbit.StepperDegree(magicbit.Steppers.STPM1, -12)
        busy = false
    }
})

function setPulse(pulses: number): void {
    pulseStack += pulses
    let tmp = pulseStack
    pulseStack = 0
    callPulse(tmp)
}

function callPulse(pulses: number): void {
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
                    angle += 6.6;
                }
            }
        } else {
            angle = steps * 5.8
        }
        minsLED.showBarGraph(tick % minsLEDrange, minsLEDrange-1)
        hoursLED.showBarGraph(tick % hoursLEDrange, hoursLEDrange-1)
        //serial.writeValue("angle", angle)
        magicbit.StepperDegree(magicbit.Steppers.STPM1, angle)
        busy = false
    }

    if (tick === hoursLEDrange) {
        tick = 0
    }
    led.plotBarGraph(tick % minsLEDrange, minsLEDrange-1)
}

function reset () {
    busy = true
    running = false
    tick = 0
    pulseStack = 0
    minsLED.setBrightness(32)
    hoursLED.setBrightness(32)
    minsLED.showBarGraph(tick % minsLEDrange, minsLEDrange-1)
    hoursLED.showBarGraph(tick % hoursLEDrange, hoursLEDrange-1)
    led.plotBarGraph(tick % minsLEDrange, minsLEDrange-1)
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

function setClock(): void {
    reset();
    running = true
    tick = DS3231.hours() * 3600 + DS3231.minutes() * 60;
    setPulse(DS3231.seconds());
}

let tick = 0
let pulseStack = 0
let running = false
let busy = false
let minsLEDrange = 60
let hoursLEDrange = 720
let minsLED: neopixel.Strip = null
let hoursLED: neopixel.Strip = null
hoursLED = neopixel.create(DigitalPin.P14, 24, NeoPixelMode.RGB)
minsLED = neopixel.create(DigitalPin.P15, 60, NeoPixelMode.RGB)
pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
basic.pause(1000)
reset()
basic.forever(function () {
	
})
