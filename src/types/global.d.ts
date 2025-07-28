declare global {
  interface Window {
    AOS: {
      init: (config?: any) => void
    }
  }
}

export {} 