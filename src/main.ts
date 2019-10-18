import { observable, action } from 'mobx'

import LoggerService from './services/logger.service'
import events from './constants/events.constants'

interface IMeta {
  provider: {
    [key: string]: string
  }
}

class SocketStore {
  private client: WebSocket | undefined
  @observable public status = ''
  @observable public methods = []
  @observable public attemptUrl: string | undefined
  @observable public attemptId: string | undefined
  @observable.ref public userData: object | undefined
  @observable public preloading = true
  @observable public meta: IMeta | undefined

  constructor() {
    this.status = 'initialized'
  }

  @action
  public connect(url: string) {
    this.client = new WebSocket(url)

    if (this.client) {
      this.client.onopen = (event) => this.handleSocketOpen(event)
      this.client.onmessage = (event) => this.handleSocketMessage(event)
      this.client.onclose = (event) => this.handleSocketClose(event)
      this.client.onerror = (error) => this.handleSocketError(error)
    }
  }

  @action handleSocketClose(event: any) {
    this.status = 'idle'
  }

  @action
  private handleSocketError(error: any) {
    this.status = 'error'
    LoggerService.log('error', error)
  }

  @action
  private handleSocketOpen(event: any) {
    this.status = 'connected'
  }

  @action
  private handleSocketMessage(event: any) {
    const data = JSON.parse(event.data)
    if (data.route === events.fetchMethods.responseTopic) {
      this.methods = data.body.methods
      this.status = 'connected'
    }
    if (data.route === events.createAttempt.responseTopic) {
      this.userData = undefined
      this.attemptUrl = data.body.attemptUrl
      this.attemptId = data.body.attemptId
      this.meta = data.body.meta
    }
    if (data.route === events.completedAuth.topic) {
      this.attemptUrl = undefined
      this.attemptId = undefined
      this.status = 'connected'
    }
    if (data.route === events.userData.topic) {
      this.userData = data.body.user
    }
  }

  @action.bound
  public sendMessage(topic: string, message: any) {
    if (this.client) {
      if (topic === events.createAttempt.topic) {
        this.status = 'authenticating'
        this.userData = undefined
      }
      this.client.send(JSON.stringify({ route: topic, body: message }))
    } else {
      this.status = 'idle'
    }
  }

  @action.bound
  public setPreloading(status: boolean) {
    this.preloading = status
  }

  @action.bound
  public reloadMethods() {
    this.status = 'fetching'
    this.userData = undefined
    this.sendMessage('FETCH_METHODS', {})
  }
}

const SocketStoreInstance = new SocketStore()
export default SocketStoreInstance
