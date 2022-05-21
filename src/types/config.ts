export interface ConfigI {
  GENERAL: {
    LANGUAGE: string
  }
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
