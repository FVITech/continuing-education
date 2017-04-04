import $ from 'jquery'

import '../scss/index.scss'

const $nav = $('.nav')

$('body').click((e) => {
    console.log( $(e.target) );
    if(!$(e.target).is('.nav-button, .nav-button .line')) {
        $nav.slideUp()
    }
})

$('.nav-button').click(() => {
    $nav.slideToggle(200)
})

$('.nav-list-li-a').click(() => {
    $nav.slideUp()
})
