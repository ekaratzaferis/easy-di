require('should')
const root = process.cwd()
const path = require('path')
const di_asap = require('../index')()

di_asap.register.withoutInjection('readyToUseModule', path.join(root + '/test/withoutInjection'))
di_asap.register.withInjection('printer', path.join(root + '/test/withInjection'))
di_asap.register.resolved('di', di_asap)

var myPrintingProject = di_asap.build()
myPrintingProject.readyToUseModule.should.startWith('This string was required via')
myPrintingProject.printer().should.startWith('\\random\\This string was required')

var temp = myPrintingProject.di.require('printer')
console.log(temp())