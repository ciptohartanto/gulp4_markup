import {src, dest, series, parallel, watch} from 'gulp'

import del from 'del'
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import webpack from 'webpack-stream'


const dirs = {
	src: 'src',
	dist: 'dist'
}
const sources = {
	sass: 'sass/**/*',
	markup: '*.pug',
	img: 'img/**/*',
	scripts: 'scripts/'

}
const compiled={
	sass: 'css',
	markup: '',
	img: 'img',
	scripts: 'scripts'
}

export const remove_dist = done => {
	del.sync([`${dirs.dist}`])
	done()
}

export const remove_img = done => {
	del.sync([`${dirs.dist}/${sources.img}`])
	done()
}

export const remove_scripts = done => {
	del.sync([`${dirs.dist}/${sources.scripts}`])
	done()
}

export const remove_stylesheet = done => {
	del.sync([`${dirs.dist}/${sources.sass}`])
	done()
}

export const remove_markup = done => {
	del.sync([`${dirs.dist}/${sources.sass}`])
	done()
}

export const stylesheet = done => {
	remove_stylesheet(done)
	src(`${dirs.src}/${sources.sass}`)
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({cascade:false}))
	.pipe(dest(`${dirs.dist}/${compiled.sass}`))
	done()
}

export const markup = done => {
	remove_markup(done)
	src(`${dirs.src}/${sources.markup}`)
	.pipe(pug())
	.pipe(dest(`${dirs.dist}/${compiled.markup}`))
	done()
}

export const img = done => {
	remove_img(done)
	src(`${dirs.src}/${sources.img}`)
	.pipe(dest(`${dirs.dist}/${compiled.img}`))
	done()
}


export const scripts = done => {
	remove_scripts(done)
	src(`${dirs.src}/${sources.scripts}/app.js`)
	.pipe(webpack({output: {
		filename: 'app.js',
	}}))
	.pipe(dest(`${dirs.dist}/${compiled.scripts}`))
	done()
}
export const live_preview = done => {
	browserSync.init({
		server: {
			baseDir: dirs.dist
		}
	})
	done()
}

export const reload_server = done => {
	browserSync.reload()
	done()
}


export const watch_dev = () => {
	watch(`${dirs.src}/`, series(markup, reload_server))
	watch(`${dirs.src}/img`, series(img, reload_server))
	watch(`${dirs.src}/sass`, series(stylesheet, reload_server))
	watch(`${dirs.src}/scripts`, series(scripts, reload_server))

}

export const dev = series(remove_dist, parallel(scripts,stylesheet,markup,img), live_preview, watch_dev)