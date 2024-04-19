export default class ErrorRateMovie extends Error {
  constructor(message, resp) {
    super(message)
    this.name = this.constructor.name
    this.response = resp
  }
}
