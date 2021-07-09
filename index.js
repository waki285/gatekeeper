const config = require("./config.json")

if (config['use_japanese']) {
  require("./japanese");
} else {
  require("./english")
}