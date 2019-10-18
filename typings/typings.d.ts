declare module '*.json' {
  const value: any
  export default value
}
declare const process: {
  env: {
    ENV: string
    URL: string
  }
}
