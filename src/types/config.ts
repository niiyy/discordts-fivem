export interface CategorieI {
  NAME: string
  ID?: string
  CATID?: string
  BUTTON: {
    NAME: string
    EMOJI: string
    TYPE: string
    ID?: string
  }
}

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
    }
  }
  TICKETS: {
    ACTIVE: boolean
    STAFF_ROLES: Array<string>
    CATEGORIES: Array<CategorieI>
  }
}
