import SceneManager from './SceneManager'

export default containerElement => {

  const canvas = createCanvas(document, containerElement)
  const sceneManager = new SceneManager(canvas)


  function createCanvas(document, containerElement) {
    const canvas = document.createElement('canvas')
    containerElement.appendChild(canvas)
    return canvas
  }

  function render() {
    sceneManager.render()
  }

  render()
}
