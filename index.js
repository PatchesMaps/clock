import Clock from './src/components/clock'

customElements.whenDefined('canvas-clock').then(() => {
  console.log('"canvas-clock" is defined.')
})
