#!/usr/bin/env node

const { spawn } = require('child_process')
const http = require('http')

const checkServer = (url, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          resolve(true)
        } else {
          setTimeout(check, 1000)
        }
      })
      
      req.on('error', () => {
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Server at ${url} not responding after ${timeout}ms`))
        } else {
          setTimeout(check, 1000)
        }
      })
    }
    
    check()
  })
}

const runTests = async () => {
  try {
    console.log('🔍 Checking if frontend is running on http://localhost:3000...')
    await checkServer('http://localhost:3000')
    console.log('✅ Frontend is running')
    
    console.log('🔍 Checking if backend is running on http://localhost:9198...')
    await checkServer('http://localhost:9198')
    console.log('✅ Backend is running')
    
    console.log('🚀 Starting Cypress tests...')
    const cypress = spawn('bun', ['cypress:run'], { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    cypress.on('close', (code) => {
      process.exit(code)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('💡 Make sure both frontend (port 3000) and backend (port 9198) are running')
    process.exit(1)
  }
}

runTests()
