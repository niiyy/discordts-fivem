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
  GUILD_MEMBER_ADD: {
    WELCOME_MESSAGE: {
      CHANNEL: string
      ACTIVE: boolean
      EMBED_COLOR: string
    }
  }
}
