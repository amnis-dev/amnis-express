# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.3.0](https://github.com/amnis-dev/amnis-express/compare/v0.2.8...v0.3.0) (2023-07-14)


### Features

* **Dependencies:** Updated necessary packages ([7e45fc2](https://github.com/amnis-dev/amnis-express/commit/7e45fc2d0343003769a38fe97b218809723f00f1))
* **Package:** Upgraded package ([e2ac0bd](https://github.com/amnis-dev/amnis-express/commit/e2ac0bd744c6014a25af5ec335aa305b26c95ad5))


### Bug Fixes

* **Package:** Resolve lock file ([f5d739e](https://github.com/amnis-dev/amnis-express/commit/f5d739e2fda9b6c8e36e0210b50057930b96bc03))

### [0.2.8](https://github.com/amnis-dev/amnis-express/compare/v0.2.7...v0.2.8) (2023-04-27)


### Bug Fixes

* **Cookies:** Fixed issue deleting cookies ([f5f872f](https://github.com/amnis-dev/amnis-express/commit/f5f872f73c72ed1063eb8ea5e4252607630f51db))

### [0.2.7](https://github.com/amnis-dev/amnis-express/compare/v0.2.6...v0.2.7) (2023-04-24)

### [0.2.6](https://github.com/amnis-dev/amnis-express/compare/v0.2.5...v0.2.6) (2023-04-24)


### Features

* **Cookie:** Same site cookie setting delcared to none ([caa0955](https://github.com/amnis-dev/amnis-express/commit/caa0955a8d0d3b64dae6357aedf1bb328a5cf2bd))
* **Cookies:** Same site property is only set to non in production ([0e750aa](https://github.com/amnis-dev/amnis-express/commit/0e750aabc3d708155c8326c62ddcb11f64b0cfa2))
* **IP:** IP address is added to the input ([c166b2c](https://github.com/amnis-dev/amnis-express/commit/c166b2cf921401ed83d8354ffa959962f499a3ce))

### [0.2.5](https://github.com/amnis-dev/amnis-express/compare/v0.2.4...v0.2.5) (2023-04-23)


### Bug Fixes

* **Cookies:** Cookies now use Lax same-site rule ([f9dd138](https://github.com/amnis-dev/amnis-express/commit/f9dd138545b8c83f663ea4d3e15eecc92657d92f))
* **Tests:** Fixed tests with new login payload ([8086f7f](https://github.com/amnis-dev/amnis-express/commit/8086f7f18985e4a1d35f9c6f49c74de1ebcb7e51))

### [0.2.4](https://github.com/amnis-dev/amnis-express/compare/v0.2.3...v0.2.4) (2023-04-20)


### Features

* **CORS:** Added header to accept credentials ([c63548f](https://github.com/amnis-dev/amnis-express/commit/c63548f48eb5fc8555b202533403cca0d1bc4187))

### [0.2.3](https://github.com/amnis-dev/amnis-express/compare/v0.2.2...v0.2.3) (2023-04-19)


### Bug Fixes

* **Service:** Resolved issue with adding a double-slash when no baseURL is specified ([34ffb82](https://github.com/amnis-dev/amnis-express/commit/34ffb8281983b5d6780c383312677cefef3172bf))

### [0.2.2](https://github.com/amnis-dev/amnis-express/compare/v0.2.1...v0.2.2) (2023-04-19)


### Features

* **CORS:** Added support to asynchronously configure CORS from system settings ([0b5d6d5](https://github.com/amnis-dev/amnis-express/commit/0b5d6d5761698d66f2302fbc88afad4614939a7f))

### [0.2.1](https://github.com/amnis-dev/amnis-express/compare/v0.2.0...v0.2.1) (2023-04-17)


### Features

* **Package:** Added necessary peer dependencies ([7c33ce5](https://github.com/amnis-dev/amnis-express/commit/7c33ce526bc9a2ed01c42f7f009a69e55648fa9d))
* **Packages:** Added express js and middleware to external modules ([47e7dec](https://github.com/amnis-dev/amnis-express/commit/47e7dec4404943ba3ceac412c48c12f752fa3318))

## [0.2.0](https://github.com/amnis-dev/amnis-express/compare/v0.1.0...v0.2.0) (2023-04-17)


### Features

* **Package:** Updated package json with export paths ([2455972](https://github.com/amnis-dev/amnis-express/commit/24559723237794f16d5933c451279710aaee7d22))

## 0.1.0 (2023-04-17)


### Features

* **Init:** Added initial configuration files for typescript and eslint ([2133afb](https://github.com/amnis-dev/amnis-express/commit/2133afbb47712ade6c467bbaa3d615d59d2f6ffe))
* **Init:** Initalized project with yarn ([52bbb4e](https://github.com/amnis-dev/amnis-express/commit/52bbb4e4ed18d93c15978535b4158bcb82f784a9))
* **Io:** Added middleware for input and output operations on express apps ([01116b3](https://github.com/amnis-dev/amnis-express/commit/01116b3d0a7b2943dcb13b99f7f67a30a0508466))
* **Router:** Added new router for CRUD requests ([96969be](https://github.com/amnis-dev/amnis-express/commit/96969bea3b79fe803ac0c5eafa17d3c78d1b8822))
* **Router:** Added router configurations ([6afb641](https://github.com/amnis-dev/amnis-express/commit/6afb641b83ec7f798ec7edd46b31d7dbd48a67e6))
* **Router:** Added router logic for amnis processors ([4d1db7a](https://github.com/amnis-dev/amnis-express/commit/4d1db7a6fbef69740955d385548f4a820a94abe6))
* **Router:** Routers can be setup with process definitions ([21c4ff3](https://github.com/amnis-dev/amnis-express/commit/21c4ff3a421f67399a614347ff54ae169aae2a14))
* **Service:** Added service setup function ([85754f7](https://github.com/amnis-dev/amnis-express/commit/85754f7804ccfc4e4aa80960fee093eb266b71a7))
* **Workflow:** Added GitHub Actions workflow files ([a093a57](https://github.com/amnis-dev/amnis-express/commit/a093a57f82c9374752cec234aa68f26794a139f0))
