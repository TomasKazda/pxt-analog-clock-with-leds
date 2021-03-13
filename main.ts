input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    basic.showNumber(servo1.getPulse())
})
input.onButtonPressed(Button.A, function () {
    servo1.setAngle(2225)
})
input.onButtonPressed(Button.B, function () {
    servo1.setPulseBy(-18)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    hoursLED.rotate(1)
    hoursLED.show()
})
let hoursLED: neopixel.Strip = null
let servo1: servoPWM.Servo = null
hoursLED = neopixel.create(DigitalPin.P1, 24, NeoPixelMode.RGB)
hoursLED.setPixelColor(0, neopixel.rgb(0, 0, 160))
hoursLED.setPixelColor(12, neopixel.rgb(160, 0, 0))
hoursLED.show()
servo1 = servoPWM.createServo(AnalogPin.P0)
servo1.setMinPulse(745)
servo1.setMaxPulse(2225)
servo1.setMaxAngle(2520)
servo1.setAngle(2225)
// if (input.buttonIsPressed(Button.A)) {
// servo1.setAngleBy(-1)
// basic.pause(20)
// } else if (input.buttonIsPressed(Button.B)) {
// servo1.setAngleBy(1)
// basic.pause(20)
// }
basic.forever(function () {
	
})
