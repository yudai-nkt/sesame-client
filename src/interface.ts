export interface Lock {
  deviceId: string
  serial: string
  nickname: string
}

export interface LockStatus {
  locked: boolean
  battery: Number
  responsive: boolean
}

export type ControlCommand = 'lock' | 'unlock' | 'sync'

export type TaskId = string

interface ExecutionResultOnSuccess {
  status: 'terminated'
  successful: true
}

interface ExecutionResultOnFailure {
  status: 'terminated'
  successful: false
  error: string
}

interface ExecutionResultOnProcess {
  status: 'processing'
}

export type ExecutionResult = ExecutionResultOnSuccess | ExecutionResultOnFailure | ExecutionResultOnProcess
