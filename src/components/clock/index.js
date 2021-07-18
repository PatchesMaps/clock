import Worker from "worker-loader!./worker.js" // eslint-disable-line

class Clock extends HTMLCanvasElement {
  constructor (props) {
    super()
    const width = window.innerWidth
    const height = window.innerHeight

    this.width = width * 2
    this.height = height * 2

    const offscreen = this.transferControlToOffscreen()

    this.worker = new Worker('/worker.js', { type: 'module', name: 'timekeeper', credentials: 'same-origin' }) // create a worker to handle clock animations without interupting the main thread
    this.worker.postMessage({ canvas: offscreen, width: this.width, height: this.height, action: 'init' }, [offscreen]) // initialize the worker and pass the OffscreenCanvas element to it

    // Add event listeners to the timer buttons
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

  connectedCallback () {
    this.worker.postMessage({ action: 'start:clock' }) // tell the worker to start animating the clock when the custom element is added to the page
  }
}

export default Clock

if (!window.customElements.get('canvas-clock')) window.customElements.define('canvas-clock', Clock, { extends: 'canvas' })