## Synopsis

This project introduces dependency injection to our project.

It's fairly simple to use.

1) Declare modules (withoutInjection) that you do not wish to inject other dependencies into.
2) Declare modules (withInjection) that will get their dependencies injected as function arguments.
3) Declare already resolved modules (resolved). These modules are JS objects that you plan on injecting somewhere else.
4) Either build the dependency tree, or require a single module from the index!

## Installation

### npm install di-asap

https://www.npmjs.com/package/di-asap

## API

**register.withoutInjection**(moduleName, fileName)
Register a module that does need injection, by passing the desired module name and the file name.
- The module name indicates the way that this module should be referenced by other in order to be injected.
- The file name is the path to the module.

**register.withInjection**(moduleName, fileName)
Register a module that need injection, by passing the desired module name and the file name.
- The module name indicates the way that this module should be referenced by other in order to be injected.
- The file name is the path to the module.
- This module should export a single function. Its arguments will be the modules that will be injected into it!
- No need to require anything anymore, not even NMP packages!

**register.resolved**(moduleName, module)
Register a module that is resolved, meaning that it does not need any injections itself.
- The module name indicates the way that this module should be referenced by other in order to be injected.
- The difference with the method **withoutInjection** is that you have to provide a JS Object, Array, String etc instead of a filename.

**require**(moduleName)
After you have registered at least one module to the index, via the register methods, you can require a single module to your code using the di-asap.
This is extremely useful for code reusability , since you can require a single service from a project that uses di-asap.

**build**
After you have register at least one module to the index, you may call the build method.
This method, resolves every single object in the index, and returns a container that makes them available to the caller.

## Code Example

Start of by requiring the di-asap module:

```javascript
const di = require('di-asap')()
```

Then register your modules:

```javascript
di.register.withoutInjection('simpleStrings', path.join(root + '/stringExamples'))
di.register.withInjection('printer', path.join(root + '/printer'))
```

Bootstrap your application
```javascript
const printingModule = di.build()
````

Printer is factory written as:
```javascript
module.exports = function (simpleStrings, path) {
    return function () {
        console.log('Start printing from: ' + path.join(process.cwd()))
        simpleStrings.forEach(function(str) { console.log(str) })
    }
}
```

Notice the arguments of the printer! They're the dependencies we wish to inject!
'simpleStrings' was a module that we registered, while should is an npm package!


Alternatively, you could require only the printer module instead of building the whole index!
```javascript
const printer = di.require('printer')
```

You may attach variables that you wish to inject to other modules by using the resolved method, or the di module itself!
```javascript
di.register.resolved('scope', {scope: 'admin'})
di.register.resolved('di', di)
```

Then inside another module you could:,
```javascript
module.exports = (di) => {
    let global_scope = di.require('scope')
    console.log(global_scope.scope) // admin //
}
```



## Motivation

This project was build in order to use the 'require' only in place in your code!
Build a 'mapping' module that takes care of your dependencies and simply inject dependencies
as function arguments!

## Tests

node test/build_spec