#!/usr/bin/env node

const os = require('os')

const request = require('request')
const { Observable: O } = require('rxjs')
const cheerio = require('cheerio')
const nodemailer = require('nodemailer')
const getRandomUserAgent = require('random-http-useragent').get

const ASSC_URL = 'https://shop.antisocialsocialclub.com/'
const SENDER = `assc-crawly@${os.hostname()}.local`

const [,, recipient] = process.argv

const getO = O.bindNodeCallback(request.get)
const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
})
const sendMailO = O.bindNodeCallback(transporter.sendMail.bind(transporter))

O.from(getRandomUserAgent())
  .concatMap(userAgent =>
    getO(ASSC_URL, {
      headers: { 'User-Agent': userAgent }
    })
  )
  .map(([ r, body ]) => body)
  .map(cheerio.load)
  .map($ => [$, $('.main-content .grid-uniform .grid__item:not(.sold-out)')])
  .map(([ $, $items ]) =>
    $items
      .map((i, el) =>
        $(el)
          .find('.grid-link__title')
          .text()
      )
      .get()
  )
  .filter(els => els.length)
  .concatMap(els => sendMailO({
    from: SENDER,
    to: recipient,
    subject: 'AVAILABLE ITEMS IN ASSC!',
    text: els.join('\n'),
  }))
  .subscribe(
    console.log,
    console.error
  )
