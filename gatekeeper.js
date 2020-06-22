/*
Run this script :

$> frida -U -l bypass-throttle.js gatekeeperd

Explainations :
    
    Frida enumeration :
    $> frida-trace -U gatekeeperd -i "*timeout*"

    19088 ms  _ZN10gatekeeper10GateKeeper19ComputeRetryTimeoutEPKNS_16failure_record_tE()
    19089 ms  _ZN10gatekeeper10GateKeeper19ComputeRetryTimeoutEPKNS_16failure_record_tE()

    Code :
    /*
    * Calculates the timeout in milliseconds as a function of the failure
    * counter 'x' as follows:
    *
    * [0, 4] -> 0
    * 5 -> 30
    * [6, 10] -> 0
    * [11, 29] -> 30
    * [30, 139] -> 30 * (2^((x - 30)/10))
    * [140, inf) -> 1 day  
    *
    * 
    uint32_t GateKeeper::ComputeRetryTimeout(const failure_record_t *record) {
        static const int failure_timeout_ms = 30000;
        if (record->failure_counter == 0) return 0;

        if (record->failure_counter > 0 && record->failure_counter <= 10) {
            if (record->failure_counter % 5 == 0) {
                return failure_timeout_ms;
            }  else {
                return 0;
            }
        } else if (record->failure_counter < 30) {
            return failure_timeout_ms;
        } else if (record->failure_counter < 140) {
            return failure_timeout_ms << ((record->failure_counter - 30) / 10);
        }

        return DAY_IN_MS;
    }
*/         

Interceptor.attach(Module.getExportByName(null,"_ZN10gatekeeper10GateKeeper19ComputeRetryTimeoutEPKNS_16failure_record_tE"), {
    onEnter: function(args){
        console.log("Called ComputeRetryTimeout");
    },
    onLeave: function(return_){
        console.log("ComputeRetryTimeout return Throttle : " + return_);
        return_.replace(0);
        console.log("Replaced with 0")
    }
})

