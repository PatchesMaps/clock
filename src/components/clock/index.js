import Worker from "worker-loader!./worker.js" // eslint-disable-line

class Clock extends HTMLCanvasElement {
  constructor (props) {
    super()
    //implementation
    window.clock = this
    const width = window.innerWidth
    const height = window.innerHeight

    this.style.position = 'absolute'
    this.style.width = `${width}px`
    this.style.height = `${height}px`
    this.width = width * 2
    this.height = height * 2
    this.props = props

    const offscreen = this.transferControlToOffscreen()

    this.worker = new Worker('/worker.js', { type: 'module', name: 'timekeeper', credentials: 'same-origin' })
    this.worker.postMessage({ canvas: offscreen, width: this.width, height: this.height, action: 'init' }, [offscreen])
  }

  connectedCallback () {
    //implementation
    console.log('connected')

    this.worker.postMessage({ action: 'start:clock' })
    document.getElementById('startButton').addEventListener('click', () => {
      this.worker.postMessage({ action: 'start:timer' })
    })
    document.getElementById('stopButton').addEventListener('click', () => {
      this.worker.postMessage({ action: 'stop:timer' })
    })
    document.getElementById('resetButton').addEventListener('click', () => {
      this.worker.postMessage({ action: 'reset:timer' })
    })
  }

  disconnectedCallback () {
    //implementation
    console.log('disconnected:')
  }

  attributeChangedCallback (name, oldVal, newVal) {
    //implementation
    console.log('attribute')
  }

  adoptedCallback () {
    //implementation
    console.log('adopted')
  }
}

export default Clock

if (!window.customElements.get('canvas-clock')) window.customElements.define('canvas-clock', Clock, { extends: 'canvas' })