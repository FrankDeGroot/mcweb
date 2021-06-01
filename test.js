import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const { error, log } = console

async function enumerate(dir) {
	return (await Promise.all((await readdir(dir))
		.map(name => join(dir, name))
		.map(async path =>
			(await stat(path)).isDirectory() ? enumerate(path) : path
		)))
		.flatMap(paths => paths)
		.filter(path => path.match(/.*\.test\.js/))
}

async function runAll() {
	const paths = await enumerate(join(process.cwd(), 'test'))
	const modules = await Promise.all(paths.map(path => import(path)))
	const succeeded = modules.flatMap(module => {
		return Object.getOwnPropertyNames(module)
			.map(name => module[name])
			.filter(testClass => testClass)
	})
	.reduce((succeeded, testClass) => {
		const { before, after } = getBeforeAfter(testClass)
		try {
			before()
			return succeeded && runClass(testClass)
		} catch(exception) {
			error(testClass.name, exception.stack)
		} finally {
			try {
				after()
			} catch(exception) {
				error(testClass.name, exception.stack)
			}
		}
		return false
	}, true)
	if(succeeded) log('All tests succeeded')
}

function runClass(testClass) {
	const classProto = testClass.prototype
	const instanceMethods = Object.getOwnPropertyNames(classProto)
	const { before, after } = getBeforeAfter(classProto)
	return instanceMethods
		.filter(method => !['constructor', 'before', 'after'].includes(method))
		.reduce((succeeded, method) => {
			let instance
			try {
				instance = new testClass
				before.apply(instance)
				classProto[method].apply(instance)
				return succeeded && true
			} catch(exception) {
				error(testClass.name, method, exception.stack)
			} finally {
				if(instance)
					try {
						after.apply(instance)
					} catch(exception) {
						error(testClass.name, method, exception.stack)
					}
			}
			return false
		}, true)
}

function getBeforeAfter(methods) {
	const ifHas = method => methods[method] || (() => {})
	return {
		before: ifHas('before'),
		after: ifHas('after')
	}
}

runAll()
