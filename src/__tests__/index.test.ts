import { RestClient } from '../index'
import nock from 'nock'

const ACCESS_TOKEN = 'fake_token'

beforeEach(() => {
  nock('https://api.candyhouse.co/public')
    .get('/sesames').reply(200,
      [
        {
          device_id: '00000000-0000-0000-0000-000000000000',
          serial: 'ABC1234567',
          nickname: 'Front door'
        },
        {
          device_id: '00000000-0000-0000-0000-000000000001',
          serial: 'DEF7654321',
          nickname: 'Back door'
        }
      ]
    )
    .get('/sesame/00000000-0000-0000-0000-000000000001').reply(200,
      {
        locked: true,
        battery: 100,
        responsive: true
      }
    )
    .post('/sesame/00000000-0000-0000-0000-000000000001', { command: 'lock' }).reply(200,
      {
        task_id: '01234567-890a-bcde-f012-34567890abcd'
      }
    )
    .get('/action-result?task_id=01234567-890a-bcde-f012-34567890abcd').reply(200,
      {
        status: 'terminated',
        successful: true
      }
    )
})

describe('test suite for RestClient.getLocksList()', () => {
  const client = new RestClient(ACCESS_TOKEN)
  it('should return a valid list of locks', async () => {
    const response = await client.getLocksList()

    expect(response).toEqual(
      [
        {
          deviceId: '00000000-0000-0000-0000-000000000000',
          serial: 'ABC1234567',
          nickname: 'Front door'
        },
        {
          deviceId: '00000000-0000-0000-0000-000000000001',
          serial: 'DEF7654321',
          nickname: 'Back door'
        }
      ]
    )
  })
})

describe('test suite for RestClient.getLockStatus()', () => {
  const client = new RestClient(ACCESS_TOKEN)
  it('should return a valid lock status', async () => {
    const response = await client.getLockStatus('00000000-0000-0000-0000-000000000001')

    expect(response).toEqual(
      {
        locked: true,
        battery: 100,
        responsive: true
      }
    )
  })

  it('should throw an error yielding device ID is required', async () => {
    await expect(client.getLockStatus()).rejects.toThrowError('Device ID is required')
  })
})

describe('test suite for RestClient.controlLock()', () => {
  const client = new RestClient(ACCESS_TOKEN)
  it('should return a valid task id', async () => {
    const response = await client.controlLock('lock', '00000000-0000-0000-0000-000000000001')

    expect(response).toEqual(
      {
        taskId: '01234567-890a-bcde-f012-34567890abcd'
      }
    )
  })

  it('should throw an error yielding device ID is required', async () => {
    await expect(client.controlLock('lock')).rejects.toThrowError('Device ID is required')
  })
})

describe('test suite for RestClient.QueryExecutionResult()', () => {
  const client = new RestClient(ACCESS_TOKEN)

  it('should return a valid excecution result', async () => {
    const response = await client.queryExecutionResult('01234567-890a-bcde-f012-34567890abcd')

    expect(response).toEqual(
      {
        status: 'terminated',
        successful: true
      }
    )
  })
})
