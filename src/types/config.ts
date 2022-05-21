export interface ConfigI {
  CLIENT: {
    TOKEN: string
    PREFIX: string
    STATUS: {
      ACTIVE: boolean
      REFRESH_INTERVAL: number
    }
  }
  FIVEM: {
    IP: string
    PORT: number
  }
}
