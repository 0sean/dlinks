module.exports = (msg, info) => {
  var date = new Date();
  console.log(`[\x1b[2m${date.getHours()}:${date.getMinutes()} - ${info}\x1b[0m] ${msg}`);
}
