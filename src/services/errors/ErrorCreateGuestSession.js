export default class ErrorCreateGuestSession extends Error {
  constructor(message, resp) {
    super(message)
    this.name = this.constructor.name
    this.response = resp
  }
}
