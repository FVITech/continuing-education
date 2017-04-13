import $ from 'jquery'
import throttle from 'lodash.throttle'

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

// cache DOM
const $body = $('body')
const $navContainer = $('.nav-container')
const $mainNav = $('.main-nav')
const homeIcon1 = { element: $('.benefits-icon.icon1'), position: null }
const homeIcon2 = { element: $('.benefits-icon.icon2'), position: null }
const homeIcon3 = { element: $('.benefits-icon.icon3'), position: null }
const testimonial1 = { element: $('.testimonial-img.img1'), position: null }
const testimonial2 = { element: $('.testimonial-img.img2'), position: null }
const testimonial3 = { element: $('.testimonial-img.img3'), position: null }

// Mobile Menu functionality
function mobileMenu() {
    if(+window.innerWidth < 768) {
        $body.click((e) => {
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

function fixMenu() {
    if($body[0].scrollTop > 40) {
        $navContainer.addClass('fixed')
        if(+window.innerWidth < 768) {
            $mainNav.css({top: '53px'})
        }
    }
    else {
        $navContainer.removeClass('fixed')
        if(+window.innerWidth < 768) {
            $mainNav.css({top: '73px'})
        }
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

// animations
const animElements = [ homeIcon1, homeIcon2, homeIcon3, testimonial1, testimonial2, testimonial3 ]
const windowHeight = $(window).height()
const offset = 230

function playAnimations() {
    animElements.forEach(el => {
        const triggerPoint = el.position - windowHeight + offset
        if(window.scrollY > triggerPoint)
            el.element.addClass('visible')
        else
            el.element.removeClass('visible')
    })
}

// scroll handler
function onScroll() {
    fixMenu()
    playAnimations()
}


$(document).ready(() => {
    homeIcon1.position = $('.benefits-icon.icon1').offset().top
    homeIcon2.position = $('.benefits-icon.icon2').offset().top
    homeIcon3.position = $('.benefits-icon.icon3').offset().top

    // wait for page height to be set
    setTimeout(function() {
        testimonial1.position = $('.testimonial-img.img1').offset().top
        testimonial2.position = $('.testimonial-img.img2').offset().top
        testimonial3.position = $('.testimonial-img.img3').offset().top
    }, 1000)

    mobileMenu()
    contactForm()
    $(document).scroll(throttle(onScroll, 100))
})
