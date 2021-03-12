let hoursLED = neopixel.create(DigitalPin.P1, 24, NeoPixelMode.RGB)
hoursLED.showRainbow(0, 270)
hoursLED.setPixelColor(9, neopixel.rgb(0, 0, 160))
hoursLED.rotate(15)
hoursLED.show() 

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
        hoursLED.rotate(1)
        hoursLED.show()  
})

basic.forever(function () {
	
})