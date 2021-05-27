import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const { log } = console

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
	const failures = sum(modules.flatMap(module => {
		return Object.getOwnPropertyNames(module)
			.map(name => module[name])
			.filter(testClass => testClass)
	})
	.flatMap(testClass => {
		const ifHas = method => testClass[method] || (() => {})
		try {
			ifHas('before')()
			return runClass(testClass)
		} finally {
			ifHas('after')()
		}
	}))
	if (failures) log(failures, 'failed')
}

function runClass(testClass) {
	const classProto = testClass.prototype
	const instanceMethods = Object.getOwnPropertyNames(classProto)
	const ifHas = method => classProto[method] || (() => {})
	const beforeEach = ifHas('before')
	const afterEach = ifHas('after')
	return sum(instanceMethods
		.filter(method => !['constructor', 'before', 'after'].includes(method))
		.map(method => {
			const instance = new testClass
			try {
				beforeEach.apply(instance)
				classProto[method].apply(instance)
				return 0
			} catch (exception) {
				log(testClass.name, method, exception.message)
				return 1
			} finally {
				afterEach.apply(instance)
			}
		}))
}

function sum(array) {
	return array.reduce((acc, val) => acc + val)
}

runAll()
