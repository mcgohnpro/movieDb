export default function getId() {
  return `id${Math.floor(Math.random() * 1e8).toString(16)}`
}
