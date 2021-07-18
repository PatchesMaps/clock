const worker = self // eslint-disable-line

class WorkerClock {
  constructor (width, height, ctx) {
    this.draw = this.draw.bind(this)
    this.width = width
    this.height = height
    this.ctx = ctx
  }

  getContext () {
    return this.ctx
  }

  degToRad (degrees) {
    return degrees * (Math.PI / 180);
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
    // ctx.beginPath()
    // ctx.arc(0, 0, radius * 0.025, 0, Math.PI * 2)
    // ctx.fillStyle = '#333'
    // ctx.fill()
    ctx.restore()
  }

  drawTicks() {
    const [x, y] = this.getClockCenter()
    const ctx = this.getContext('2d')
    const radius = this.getClockRadius()

    ctx.save()
    ctx.translate(x, y)
    ctx.font = radius * 0.15 + "px arial";
    ctx.lineWidth = 1
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let num = 0; num < 60;) {
      num++
      const ang = num * Math.PI / 30;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      if (!(num % 5)) {
        ctx.lineWidth = 5
        ctx.beginPath();
        ctx.moveTo(0, -100)
        ctx.lineTo(0, -radius * 0.15);
        ctx.stroke()
        ctx.rotate(-ang);
        ctx.fillText((num / 5).toString(), 0, 0);
        ctx.fill();
        ctx.rotate(ang);
      }
      else {
        ctx.lineWidth = 1
        ctx.beginPath();
        ctx.moveTo(0, -150)
        ctx.lineTo(0, -radius * 0.15);
        ctx.stroke()
      }
      // ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }

    ctx.restore()
  }

  drawClockFace () {
    const [x, y] = this.getClockCenter()
    const radius = this.getClockRadius()

    this.drawClock(x, y, radius)
    this.drawTicks()
  }

  drawHourHand() {
    const date = new Date()
    const radius = this.getClockRadius()
    const ctx = this.getContext('2d')
    const hours = date.getHours() + date.getMinutes() / 60
    const [x, y] = this.getClockCenter()

    ctx.save()
    ctx.translate(x, y)
    ctx.lineWidth = 30
    ctx.rotate(hours * ((Math.PI * 2) / 12))
    ctx.beginPath();
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

  draw() {
    const ctx = this.getContext('2d')

    ctx.clearRect(0, 0, this.width, this.height)

    this.drawClockFace()
    this.drawHourHand()
    this.drawMinuteHand()
    this.drawSecondHand()
    requestAnimationFrame(this.draw)
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
      requestAnimationFrame(this.clock.draw)
  }
})