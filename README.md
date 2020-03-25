# sesame-client

[![NPM](https://img.shields.io/npm/v/sesame-client)](https://www.npmjs.com/package/sesame-client)
[![Node.js CI](https://github.com/yudai-nkt/sesame-client/workflows/Node.js%20CI/badge.svg)](https://github.com/yudai-nkt/sesame-client/actions?query=workflow%3A%22Node.js+CI%22)
[![Test coverage](https://img.shields.io/codecov/c/github/yudai-nkt/sesame-client?logo=codecov)](https://codecov.io/gh/yudai-nkt/sesame-client)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Node.js client for Sesami smart lock API

```javascript
const sesame = require('sesame-client')
const myLock = new sesame.RestClient('API_TOKEN', 'DEVICE_ID')

async function toggle () {
  const currStatus = await myLock.getLockStatus()
  await myLock.controlLock(currStatus.locked ? 'unlock' : 'lock')
}
```

## Installation
Run the following command in your project root.

```console
npm install sesame-client
```

## Usage
See [API documentation][].

## Contribution
Contributions are welcome. Feel free to report an issue or submit a pull request.
 
## License
This package is distributed under the MIT License.
See [LICENSE.md](./LICENSE.md) for details.

## Reference
- Sesame smart lock API documentation: https://docs.candyhouse.co/

[API documentation]: https://yudai-nkt.github.io/sesame-client
