var Tail = require("always-tail");
var fs = require("fs");
var exec = require("child_process").exec;

var MIN_REBOOT_INTERVAL = 30 * 60;

var log_path = process.env.REBOOTER_LOG_PATH;
if (!log_path) {
  console.error("You must define the REBOOTER_LOG_PATH environment variable!");
  process.exit(1);
}
var tail = new Tail(log_path);

tail.on("line", function(data) {
  if (data.indexOf("Exit code: nil.") == -1) {
    return;
  }
  fs.readFile("/proc/uptime", function(error, data) {
    if (error) {
      console.error("Error while getting uptime: " + error);
    } else {
      var uptime = parseFloat(data.toString().split(" ")[0]);
      console.log("Uptime: " + uptime);
      if (uptime > MIN_REBOOT_INTERVAL) {
        console.log("Rebooting...");
        exec("reboot", function() {
          console.log("Bye!");
        })
      }
    }
  });
});
