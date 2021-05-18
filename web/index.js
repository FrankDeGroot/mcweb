self._ = uhtml.html
const socket = io()
	.on('reload', () => location.reload())
	.on('pong', () => console.log('pong'))
uhtml.render(document.body, _`<h1>${new Date().toISOString()}</h1>`)
