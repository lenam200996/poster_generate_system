const tokens = require('./token.json')

const compile = (categoryKey) => {
  for (const [key, keyObj] of Object.entries(tokens[categoryKey])) {
    if (typeof tokens[categoryKey][key].value === 'string') {
      tokens[categoryKey][key] = keyObj.value
    } else {
      for (const [subkey, subkeyObj] of Object.entries(keyObj)) {
        if (typeof subkeyObj.value === 'string') {
          keyObj[subkey] = subkeyObj.value
        }
      }
    }
  }
}

for (const [key, keyObj] of Object.entries(tokens)) {
  if (typeof tokens[key].value === 'string') {
    tokens[key] = keyObj.value
  } else {
    for (const [subkey, subkeyObj] of Object.entries(keyObj)) {
      if (typeof subkeyObj.value === 'string') {
        keyObj[subkey] = subkeyObj.value
      } else {
        compile(key)
      }
    }
  }
}

module.exports = tokens
