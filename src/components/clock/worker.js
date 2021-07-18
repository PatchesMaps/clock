const worker = self // eslint-disable-line

class WorkerClock {
  constructor (width, height, ctx) {
    this.draw = this.draw.bind(this)
    this.width = width
    this.height = height
    this.ctx = ctx
    this.timer = {
      active: false,
      start: null,
      elapsedTime: 0,
      previouslyElapsedTime: 0
    }
  }

  getContext () { // this isn't really necessary but keeps the api familiar if you want to do something similar outside of the worker context
    return this.ctx
  }

  getClockRadius () { // utility to calculate the radius of the clock's outer circle
    return (Math.min(this.width, this.height) / 2) - 100
  }

  getClockCenter () { // utility for calculating the center of the circle
    const x = this.width / 2
    const y = this.height / 2

    return [x, y]
  }

  drawClock (x, y, radius) {
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y) // translate the origin so we can draw from [0,0]
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2, true) // Outer circle
    ctx.moveTo(110, 75)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawTicks (opts) {
    const {
      x,
      y,
      radius,
      ticks, // the number of ticks
      labelInterval = 5,
      labelDivisor = 1, // this is so you can have more ticks than labels
      tick = { width: 1, length: 100 }, // tick style
      labelTick = { width: 5, length: 150 } // label tick style
    } = opts
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y) // translate the origin so we can draw from [0,0]
    ctx.font = radius * 0.15 + "px arial"
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"

    for (let i = 0; i < ticks;) {
      i++ // iterating i outside of the for statement lets us start logically from 1 instead of 0
      const ang = i * Math.PI / (ticks / 2)
      ctx.rotate(ang)
      ctx.translate(0, -radius * 0.85)
      if (i % labelInterval) {
        ctx.lineWidth = tick.width
        ctx.beginPath()
        ctx.moveTo(0, tick.length * -1)
        ctx.lineTo(0, -radius * 0.15)
        ctx.stroke()
      }
      else {
        ctx.lineWidth = labelTick.width
        ctx.beginPath()
        ctx.moveTo(0, labelTick.length * -1)
        ctx.lineTo(0, -radius * 0.15)
        ctx.stroke()
        ctx.rotate(-ang)
        ctx.fillText((i / labelDivisor).toString(), 0, 0)
        ctx.fill()
        ctx.rotate(ang)
      }
      ctx.translate(0, radius * 0.85)
      ctx.rotate(-ang)
    }

    ctx.restore() // restore the context to it's original state
  }

  drawClockFace () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()

    this.drawClock(x, y, radius)
    this.drawTicks({ x, y, radius, ticks: 60, labelDivisor: 5 })
  }

  drawHoursTimer () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()
    const offset = radius / 3
    const r = radius / 8

    this.drawClock(x - offset, y, r)
    this.drawTicks({
      x: x - offset,
      y,
      radius: r,
      ticks: 12,
      labelInterval: 1
    })
    const hours = this.timer.elapsedTime / 3600000
    let accumulatedHours = hours % 12
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x - offset, y)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#a103fc'
    ctx.rotate(accumulatedHours * ((Math.PI * 2) / 12))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawMinutesTimer () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()
    const offset = radius / 3
    const r = radius / 8

    this.drawClock(x, y - offset, r)
    this.drawTicks({
      x,
      y: y - offset,
      radius: r,
      ticks: 60,
      labelInterval: 5
    })
    const minutes = this.timer.elapsedTime / 60000
    let accumulatedMinutes = minutes % 60
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y - offset)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#03fc3d'
    ctx.rotate(accumulatedMinutes * ((Math.PI * 2) / 60))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawSecondsTimer () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()
    const offset = radius / 3
    const r = radius / 8

    this.drawClock(x + offset, y, r)
    this.drawTicks({
      x: x + offset,
      y,
      radius: r,
      ticks: 60,
      labelInterval: 5
    })
    const seconds = this.timer.elapsedTime / 1000
    let accumulatedSeconds = seconds % 60
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x + offset, y)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#03a1fc'
    ctx.rotate(accumulatedSeconds * ((Math.PI * 2) / 60))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawMilliSecondsTimer () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()
    const offset = radius / 3
    const r = radius / 8

    this.drawClock(x, y + offset, r)
    this.drawTicks({
      x,
      y: y + offset,
      radius: r,
      ticks: 100,
      labelInterval: 5,
      labelDivisor: 0.1
    })
    let accumulatedMilliseconds = this.timer.elapsedTime % 1000
    const ctx = this.getContext('2d')

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y + offset)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.rotate(accumulatedMilliseconds * ((Math.PI * 2) / 1000))
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawTimerFaces () {
    this.drawHoursTimer()
    this.drawMinutesTimer()
    this.drawSecondsTimer()
    this.drawMilliSecondsTimer()
  }

  startTimer () {
    this.timer.start = Date.now()
    this.timer.active = true
  }

  stopTimer () {
    this.timer.start = null
    this.timer.active = false
    this.timer.previouslyElapsedTime = this.timer.elapsedTime
  }

  resetTimer () {
    this.timer.start = null
    this.timer.active = false
    this.timer.elapedTime = 0
    this.timer.previouslyElapsedTime = 0
  }

  drawHourHand () {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const hours = date.getHours() + date.getMinutes() / 60
    const [x, y] = this.getClockCenter()

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y) // translate the origin so we can draw from [0,0]
    ctx.lineWidth = 30
    ctx.rotate(hours * ((Math.PI * 2) / 12))
    ctx.beginPath()
    ctx.moveTo(0, (radius - radius * 0.10) * -1)
    ctx.lineTo(0, radius * -1);
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawMinuteHand () {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const minutes = date.getMinutes() + date.getSeconds() / 60
    const [x, y] = this.getClockCenter()

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y) // translate the origin so we can draw from [0,0]
    ctx.lineWidth = 20
    ctx.strokeStyle = '#4f4f4f'
    ctx.rotate(minutes * ((Math.PI * 2) / 60))
    ctx.beginPath()
    ctx.moveTo(0, (radius - radius * 0.15) * -1)
    ctx.lineTo(0, radius * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawSecondHand () {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const seconds = date.getSeconds()
    const [x, y] = this.getClockCenter()

    ctx.save() // save the context's state so it can be restored after making modifications
    ctx.translate(x, y) // translate the origin so we can draw from [0,0]
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 10
    ctx.rotate(seconds * ((Math.PI * 2) / 60))
    ctx.beginPath()
    ctx.moveTo(0, (radius - radius * 0.20) * -1)
    ctx.lineTo(0, radius * -1)
    ctx.stroke()
    ctx.restore() // restore the context to it's original state
  }

  drawHands () {
    this.drawHourHand()
    this.drawMinuteHand()
    this.drawSecondHand()
  }

  draw () {
    const { previouslyElapsedTime } = this.timer
    const ctx = this.getContext('2d')
    const date = Date.now()
    if (this.timer.active) {
      this.timer.elapsedTime = previouslyElapsedTime + date - this.timer.start // adding on the previously elapsed time lets us restart the timer from where we left off 
    } else if (previouslyElapsedTime === 0) {
      this.timer.elapsedTime = 0 // this lets us reset the timer
    }

    ctx.clearRect(0, 0, this.width, this.height) // clear before drawing

    this.drawClockFace()
    this.drawTimerFaces()
    this.drawHands()
    requestAnimationFrame(this.draw) // propagate the animation loop
  }
}

worker.addEventListener('message', event => {
  switch (event.data.action) {
    case 'init':
      const { width, height, canvas } = event.data
      const ctx = canvas.getContext('2d')

      this.clock = new WorkerClock(width, height, ctx)
      break
    case 'start:clock':
      requestAnimationFrame(this.clock.draw) // start the animation loop
      break
    case 'start:timer':
      this.clock.startTimer?.()
      break
    case 'stop:timer':
      this.clock.stopTimer?.()
      break
    case 'reset:timer':
      this.clock.resetTimer?.()
      break
    default:
      console.warn(`Unknown message action: ${event.data.action}`)
  }
})