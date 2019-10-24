import {src,dest, series, parallel} from 'gulp'

import del from 'del'
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import { watch } from 'fs'

const dirs = {
	src: 'src',
	dist: 'dist'
}
const sources = {
	sass: 'sass/**/*',
	markup: '*.pug',
	img: 'img/**/*'
}
const compiled={
	sass: 'css',
	markup: '',
	img: 'img'
}

export const remove_dist = done => {
	del.sync([`${dirs.dist}`])
	done()
}

export const remove_img = done => {
	del.sync([`${dirs.dist}/${sources.img}`])
	done()
}

export const stylesheet = done => {
	src(`${dirs.src}/${sources.sass}`)
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({cascade:false}))
	.pipe(dest(`${dirs.dist}/${compiled.sass}`))
	done()
}

export const markup = done => {
	src(`${dirs.src}/${sources.markup}`)
	.pipe(pug())
	.pipe(dest(`${dirs.dist}/${compiled.markup}`))
	done()
}

export const sync_img = done => {
	src(`${dirs.src}/${sources.img}`)
	.pipe(dest(`${dirs.dist}/${compiled.img}`))
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
	watch(`${dirs.src}/img`, series(remove_img, sync_img, reload_server))
	watch(`${dirs.src}/sass`, series(stylesheet, reload_server))
}

export const dev = series(remove_dist, parallel(stylesheet,markup,sync_img), live_preview, watch_dev)