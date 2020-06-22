#!/usr/bin/python
import frida

def message(message, data):
    print(message)

device = frida.get_usb_device()

session_gatekeeper =  device.attach("gatekeeperd")
script_gatekeeper = session_gatekeeper.create_script(open("gatekeeper.js","r").read())
script_gatekeeper.on("message", message)
script_gatekeeper.load()

session_systemui = device.attach("com.android.systemui")
script_systemui = session_systemui.create_script(open("systemui.js","r").read())
script_systemui.on("message", message)
script_systemui.load()

input()
