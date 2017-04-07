import $ from 'jquery'

import '../scss/index.scss'

// allow hot reload for html files by requiring them here
if(process.env.NODE_ENV === 'development') {
    // pages
    require('../views/pages/index.pug')
    require('../views/pages/courses.pug')
    require('../views/pages/home-health-aide.pug')
    require('../views/pages/medical-assistant.pug')
    require('../views/pages/medical-coding-specialist.pug')
    require('../views/pages/patient-care-technician.pug')
    require('../views/pages/pharmacy-technician.pug')

    // partials
    require('../views/partials/footer.pug')
    require('../views/partials/contact-modal.pug')
    require('../views/partials/partners.pug')
    require('../views/partials/cta.pug')
    require('../views/partials/header.pug')
    require('../views/partials/layout.pug')
    require('../views/partials/head.pug')
}

// Mobile Menu functionality
function mobileMenu() {
    const $mainNav = $('.main-nav')

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
}

// contact modal and form
function contactForm() {
    const $contactModal = $('.contact-modal')

    $('.contact-modal .overlay, .contact-modal .close').click(() => {
        $contactModal.fadeOut(200)
    })

    $('.contact-btn').click(e => {
        e.preventDefault()
        $contactModal.show(0)
    })

    $('#contact-form').submit(e => {
        e.preventDefault()
        $.ajax({
            url: 'http://fvi-grad.com:4004/email',
            method: 'POST',
            data: $('#contact-form').serialize()
        })
        .done(data => {
            $('#contact-form').hide()
            $('.thank-you').show()
            $('#contact-form')[0].reset()
        })
        .fail(err => {
            console.log(err);
        })
    })
}

$(document).ready(() => {
    AOS.init()
    mobileMenu()
    contactForm()
})
