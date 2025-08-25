import { SHA256 } from 'crypto-js'
import { DateTime } from 'luxon'

export async function generateTimestamp() {
  const tehranNow = DateTime.now().setZone('Asia/Tehran').startOf('second')

  const timestamp = Math.floor(tehranNow.toSeconds() / 1000)

  console.log('Tehran Time:', tehranNow.toFormat('yyyy-MM-dd HH:mm:ss'))
  console.log('Timestamp:', timestamp)

  return timestamp
}

export async function consistentShuffle(str) {
  if (!str || str.length === 0) {
    return str
  }
  return str.split('').reverse().join('')
}

export async function stringResult(salt, timestamp) {
  const shuffle = await consistentShuffle(salt)
  const prefix = import.meta.env.VITE_PREFIX
  const suffix = import.meta.env.VITE_SUFFIX
  const input = `${prefix}${shuffle}${suffix}${timestamp}`

  return input
}

export async function multiHash(value, hashRounds, salt) {
  const shuffle = await consistentShuffle(salt)
  for (let i = 0; i < hashRounds; i++) {
    const dataToHash = value + shuffle.split('').reverse().join('') + i
    value = await sha256(dataToHash)
    value = value.slice(0, 32)
  }

  return value
}

export async function sha256(value) {
  return SHA256(value).toString()
}

export async function transformString(input, salt) {
  const allowedChars = import.meta.env.VITE_ALLOWED_CHARS
  let hash = await multiHash(input, 5, salt)
  let transformed = ''
  const desiredLength = 36
  const rounds = 3

  for (let round = 0; round < rounds; round++) {
    let roundHash = await multiHash(hash + round, 3, salt)
    for (let i = 0; transformed.length < desiredLength; i++) {
      const segment = roundHash.slice(i * 3, i * 3 + 3)
      const numericValue = parseInt(segment, 16) || 0
      const index = (numericValue + i + round) % allowedChars.length
      transformed += allowedChars[index]

      if (i * 3 + 3 >= roundHash.length) {
        roundHash = await multiHash(roundHash, 2, salt)
        i = -1
      }
    }
    if (transformed.length >= desiredLength) {
      break
    }
  }

  return transformed.substring(0, desiredLength)
}

export async function generateCypherKey() {
  let salt = import.meta.env.VITE_SALT
  const newTimestamp = await generateTimestamp()

  console.log('newTimestamp', newTimestamp)

  const newStringResult = await stringResult(salt, newTimestamp)
  let transformed = await transformString(newStringResult, salt)

  console.log('Cypher Key:', transformed)

  return transformed
}
