import { logLevels } from '../constants/log.constants'

class LoggerService {
  private env = process.env['NODE_ENV']

  private formatMsg = (level: string, msg: string): string => `%c ${logLevels[level].label}${msg}`

  private getLevelStyle = (level: string): string => logLevels[level].style

  log = (level: string, msg: string): void => {
    switch (this.env) {
      case 'development':
        console.log(this.formatMsg(level, msg), this.getLevelStyle(level))
        break
      default:
        break
    }
  }
}

const service = new LoggerService()

export default service
