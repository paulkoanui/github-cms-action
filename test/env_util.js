function setEnv(key, value, prefix){
  process.env[`${prefix || ''}${key.replace(/ /g, '_').toUpperCase()}`] = value
}

function setupVars(vars, prefix){
  for (const key in vars){
    setEnv(key, vars[key], prefix)
  }
}

module.exports = { setupVars, setEnv }