import $ from 'jquery'

import '../scss/index.scss'

const $mainNav = $('.main-nav')

// Mobile Menu functionality
if(+window.innerWidth < 768) {
    $('body').click((e) => {
        if(!$(e.target).is('.nav-button, .nav-button .line')) {
            $mainNav.slideUp()
        }
    })

    $('.nav-button').click(() => {
        $mainNav.slideToggle(200)
    })

    $('.nav-list-li-a').click(() => {
        $mainNav.slideUp()
    })
}
