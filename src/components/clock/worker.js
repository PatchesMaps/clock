const worker = self // eslint-disable-line

class WorkerClock {
  constructor (width, height, ctx) {
    this.draw = this.draw.bind(this)
    this.width = width
    this.height = height
    this.ctx = ctx
    this.timer = {
      active: false,
      start: null
    }
  }

  getContext () {
    return this.ctx
  }

  getClockRadius() {
    return (Math.min(this.width, this.height) / 2) - 100
  }

  getClockCenter() {
    const x = this.width / 2
    const y = this.height / 2

    return [x, y]
  }

  drawClock(x, y, radius) {
    const ctx = this.getContext('2d')

    ctx.save()
    ctx.translate(x, y)
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2, true) // Outer circle
    ctx.moveTo(110, 75)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.015, 0, Math.PI * 2)
    ctx.fillStyle = '#333'
    ctx.fill()
    ctx.restore()
  }

  drawTicks(opts) {
    const {
      x,
      y,
      radius,
      ticks,
      labelInterval = 5,
      labelDivisor = 1,
      tick = { width: 1, length: 100 },
      labelTick = { width: 5, length: 150 }
    } = opts
    const ctx = this.getContext('2d')

    ctx.save()
    ctx.translate(x, y)
    ctx.font = radius * 0.15 + "px arial"
    ctx.lineWidth = 1
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"

    for (let num = 0; num < ticks;) {
      num++
      const ang = num * Math.PI / (ticks / 2);
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85)
      if (!(num % labelInterval)) {
        ctx.lineWidth = labelTick.width
        ctx.beginPath()
        ctx.moveTo(0, labelTick.length * -1)
        ctx.lineTo(0, -radius * 0.15)
        ctx.stroke()
        ctx.rotate(-ang);
        ctx.fillText((num / labelDivisor).toString(), 0, 0)
        ctx.fill();
        ctx.rotate(ang);
      }
      else {
        ctx.lineWidth = tick.width
        ctx.beginPath();
        ctx.moveTo(0, tick.length * -1)
        ctx.lineTo(0, -radius * 0.15)
        ctx.stroke()
      }
      ctx.translate(0, radius * 0.85)
      ctx.rotate(-ang)
    }

    ctx.restore()
  }

  drawClockFace () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()

    this.drawClock(x, y, radius)
    this.drawTicks({ x, y, radius, ticks: 60, labelDivisor: 5 })
  }

  drawHoursTimer (date) {
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
    const hoursDelta = (date / 3600000) - (this.startTime / 3600000)
    let accumulatedHours = hoursDelta % 12
    const ctx = this.getContext('2d')

    if (!this.timer.start) accumulatedHours = 0

    ctx.save()
    ctx.translate(x - offset, y)
    ctx.lineWidth = 2
    ctx.rotate(accumulatedHours * ((Math.PI * 2) / 12))
    ctx.beginPath();
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawMinutesTimer (date) {
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
    const minutesDelta = (date / 60000) - (this.timer.start / 60000)
    let accumulatedMinutes = minutesDelta % 60
    const ctx = this.getContext('2d')

    if (!this.timer.start) accumulatedMinutes = 0

    ctx.save()
    ctx.translate(x, y - offset)
    ctx.lineWidth = 2
    ctx.rotate(accumulatedMinutes * ((Math.PI * 2) / 60))
    ctx.beginPath();
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawSecondsTimer (date) {
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
    const secondsDelta = (date / 1000) - (this.timer.start / 1000)
    let accumulatedSeconds = secondsDelta % 60
    const ctx = this.getContext('2d')

    if (!this.timer.start) accumulatedSeconds = 0

    ctx.save()
    ctx.translate(x + offset, y)
    ctx.lineWidth = 2
    ctx.rotate(accumulatedSeconds * ((Math.PI * 2) / 60))
    ctx.beginPath();
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawMilliSecondsTimer (date) {
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
    const millisecondsDelta = date - this.timer.start
    let accumulatedMilliseconds = millisecondsDelta % 1000
    const ctx = this.getContext('2d')

    if (!this.timer.start) accumulatedMilliseconds = 0

    ctx.save()
    ctx.translate(x, y + offset)
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2
    ctx.rotate(accumulatedMilliseconds * ((Math.PI * 2) / 1000))
    ctx.beginPath();
    ctx.moveTo(0, 0)
    ctx.lineTo(0, r * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawTimerFaces (date) {
    this.drawHoursTimer(date)
    this.drawMinutesTimer(date)
    this.drawSecondsTimer(date)
    this.drawMilliSecondsTimer(date)
  }

  startTimer () {
    if (!this.timer.start) this.timer.start = Date.now()
    this.timer.active = true
  }

  stopTimer () {
    this.timer.active = false
  }

  resetTimer () {
    this.timer.start = null
    this.timer.active = false
  }

  drawHourHand () {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const hours = date.getHours() + date.getMinutes() / 60
    const [x, y] = this.getClockCenter()

    ctx.save()
    ctx.translate(x, y)
    ctx.lineWidth = 30
    ctx.rotate(hours * ((Math.PI * 2) / 12))
    ctx.beginPath()
    ctx.moveTo(0, (radius - radius * 0.10) * -1)
    ctx.lineTo(0, radius * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawMinuteHand() {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const minutes = date.getMinutes() + date.getSeconds() / 60
    const [x, y] = this.getClockCenter()

    ctx.save()
    ctx.translate(x, y)
    ctx.lineWidth = 20
    ctx.strokeStyle = '#262626'
    ctx.rotate(minutes * ((Math.PI * 2) / 60))
    ctx.beginPath();
    ctx.moveTo(0, (radius - radius * 0.15) * -1)
    ctx.lineTo(0, radius * -1);
    ctx.stroke()
    ctx.restore()
  }

  drawSecondHand() {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const seconds = date.getSeconds()
    const [x, y] = this.getClockCenter()

    ctx.save()
    ctx.translate(x, y)
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10
    ctx.rotate(seconds * ((Math.PI * 2) / 60))
    ctx.beginPath();
    ctx.moveTo(0, (radius - radius * 0.20) * -1)
    ctx.lineTo(0, radius * -1);
    ctx.stroke()
    ctx.restore()
  }

  draw(lastDate) {
    const ctx = this.getContext('2d')
    let date = this.timer.active ? Date.now() : lastDate

    ctx.clearRect(0, 0, this.width, this.height)

    this.drawClockFace()
    this.drawTimerFaces(date)
    this.drawHourHand()
    this.drawMinuteHand()
    this.drawSecondHand()
    requestAnimationFrame(() => this.draw(date))
  }
}

worker.addEventListener('message', event => {
  switch (event.data.action) {
    case 'init':
      const { width, height, canvas } = event.data
      const ctx = canvas.getContext('2d')

      this.clock = new WorkerClock(width, height, ctx)
      break;
    case 'start:clock':
      console.log('event.data.action:', event.data.action)
      requestAnimationFrame(this.clock.draw)
      break;
    case 'start:timer':
      console.log('event.data.action:', event.data.action)
      this.clock.startTimer?.()
      break;
    case 'stop:timer':
      console.log('event.data.action:', event.data.action)
      this.clock.stopTimer?.()
      break;
    case 'reset:timer':
      console.log('event.data.action:', event.data.action)
      this.clock.resetTimer?.()
      break;
    default:
      console.warn(`Unknown message action: ${event.data.action}`)
  }
})