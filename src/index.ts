import axios, { AxiosInstance } from 'axios'
import camelcaseKeys from 'camelcase-keys'
import * as Sesame from './interface'
import * as util from './util'

/**
 * The REST API client class.
 *
 * This class manipulates Sesame smart lock using RESTful API.
 */
export class RestClient {
  /**
   * Axios instance dedicated to Sesame API.
   */
  private readonly axios: AxiosInstance

  /**
   * Device ID of your smart lock. If `undefined`, the instance
   * controls all the Sesame devices you own.
   */
  private readonly deviceId: undefined | string

  /**
   * Create a new REST API client instance.
   * @param accessToken Access token issued by CANDY HOUSE.
   * @param deviceId Device ID of your Sesame device. If `undefined`, the instance
   * controls all the Sesame devices you own.
   */
  constructor (accessToken: string, deviceId?: string) {
    this.deviceId = deviceId
    this.axios = axios.create({
      baseURL: 'https://api.candyhouse.co/public',
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
  }

  /**
   * Get a list of locks you own.
   */
  async getLocksList (): Promise<Sesame.Lock[]> {
    const response = await this.requestGet<Sesame.Lock[]>('/sesames')
    return response
  }

  /**
   * Get a status of lock
   * @param deviceId Device ID whose status you want to check. If `undefined` and you own only one lock,
   * ID will be automatically inferred.
   * @throws Will throw an error if the argument is not passed and you manage more than one locks.
   */
  async getLockStatus (deviceId?: string): Promise<Sesame.LockStatus> {
    deviceId = deviceId ?? await this.inferDeviceId()
    if (deviceId !== undefined) {
      const response = await this.requestGet<Sesame.LockStatus>(`/sesame/${deviceId}`)
      return response
    } else {
      throw new Error('Device ID is required')
    }
  }

  /**
   * Control your lock.
   * @param command Command to perform.
   * @param deviceId Device ID you want to control. If `undefined` and you own only one lock,
   * ID will be automatically inferred.
   * @throws Will throw an error if the argument is not passed and you manage more than one locks.
   */
  async controlLock (command: Sesame.ControlCommand, deviceId?: string): Promise<Sesame.TaskId> {
    deviceId = deviceId ?? await this.inferDeviceId()
    if (deviceId !== undefined) {
      const response = await this.requestPost<Sesame.TaskId>(`/sesame/${deviceId}`, { command: command })
      return response
    } else {
      throw new Error('Device ID is required')
    }
  }

  /**
   * Fetch a result of command execution associated with the task ID.
   * @param taskId Task ID you want to qeury.
   */
  async queryExceutionResult (taskId: Sesame.TaskId): Promise<Sesame.ExecutionResult> {
    const response = await this.requestGet<Sesame.ExecutionResult>(`/action-result?task_id=${taskId}`)
    return response
  }

  /**
   * Infer your device ID if you own only one lock or you explicitly speficied ID at instanciation.
   * Returns `undefined` if ID inference fails.
   */
  /* istanbul ignore next */
  private async inferDeviceId (): Promise<undefined | string> {
    const locksList = await this.getLocksList()
    return locksList.length === 1 ? locksList[0].deviceId : this.deviceId
  }

  /**
   * Wrapper for `axios.get()`.
   * @param url
   */
  /* istanbul ignore next */
  private async requestGet<T> (url: string): Promise<T> {
    try {
      const response = await this.axios.get(url)
      return camelcaseKeys(response.data)
    } catch (error) {
      if (util.isAxiosError(error) && error.response !== undefined) {
        throw new Error(`Something went wrong (HTTP status code: ${error.response.status})`)
      }
      throw error
    }
  }

  /**
   * Wrapper for `axios.post()`.
   * @param url
   * @param body
   */
  /* istanbul ignore next */
  private async requestPost<T> (url: string, body: Object): Promise<T> {
    try {
      const response = await this.axios.post(url, body)
      return camelcaseKeys(response.data)
    } catch (error) {
      if (util.isAxiosError(error) && error.response !== undefined) {
        throw new Error(`Something went wrong (HTTP status code: ${error.response.status})`)
      }
      throw error
    }
  }
}
