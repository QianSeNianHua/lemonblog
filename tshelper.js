module.exports = {
  watchDirs: {
    model: {
      enabled: true,
      directory: './app/model',
      generator: 'class',
      interfaceHandle: (val) => {
        return `ModelInstance<${ val }>`
      },
      interface: 'IModel',
      declareTo: 'Context.model'
    }
  }
}