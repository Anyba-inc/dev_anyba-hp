(() => {
    window.addEventListener('DOMContentLoaded', () => {
        return new Promise((resolve, reject) => { 
            init(resolve()); 
        }).then(() => {
            set_cookie() ? action_home() : action_no_home();
        });
    }) 
})(); 
const colors = ['#EEAA1E', '#E94746', '#C14284', '#FFAC52', '#EBE1A9']; /*brand color of logo*/ 
const wmax = window.innerWidth / 1;
const wmin = window.innerWidth / (-1);
const hmax = window.innerHeight / 1;
const hmin = window.innerHeight / (-1);
const toggle = { menu: false };
const client = contentful.createClient({ space: '0ur8wylaqiku', accessToken: 'HeyjUfBwQufqQD3ox1RM9ZmXiSF_UW4YPCQlqFyy07w', });
const swiper_service_container = new Swiper('.swiper-container', { 
    autoplay: { 
        delay: 3000 
    }, 
    speed: 500, 
    loop: true, 
    slidesPerView: 1,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true,
	}
});
const swiper_works_container = new Swiper('.works-container', { autoplay: { delay: 1200 }, speed: 500, loop: true, slidesPerView: 4.8, spaceBetween: window.innerWidth * 0.08});

function init(){
    window.innerWidth < 1025 ? document.querySelector('.nav_img img').src = 'https://anyba.jp/img/anyba_side_white.png' : '';
    client.getEntries({ limit: 3 }).then((response) => {
        for (let i = 0; i < response.items.length; i++) {
            /*footerニュース単体のタイトル更新*/ 
            if ((response.items[i].fields.title != undefined) || (response.items[i].fields.title != null)){
                if (response.items[i].fields.title.length >= 43) {
                    document.getElementsByClassName('footer_news_title')[i].innerHTML = response.items[i].fields.title.slice(0, 43) + '…';
                } else {
                    document.getElementsByClassName('footer_news_title')[i].innerHTML = response.items[i].fields.title;
                }
            } else { 
                document.getElementsByClassName('footer_news_title')[i].innerHTML = '新しいニュース';
            } 
            /*footerニュース単体の公開時期更新*/
            if ((response.items[i].fields.date != undefined) || (response.items[i].fields.date != null)){ 
                document.getElementsByClassName('footer_news_date')[i].innerHTML = response.items[i].fields.date.split('T')[0].replace(/-/g,'.');
            } else {
                document.getElementsByClassName('footer_news_date')[i].innerHTML = '';
            }
            /*footerニュース単体のサムネイル更新*/
            if ((response.items[i].fields.headerImage != undefined) || (response.items[i].fields.headerImage != null)){ 
                document.getElementsByClassName('footer_news_img')[i].src = response.items[i].fields.headerImage.fields.file.url;
            } else {
                document.getElementsByClassName('footer_news_img')[i].src = 'https://anyba.jp/img/anyba_side_news.png';
            } 
            /*footerニュース単体のhref更新*/ 
            document.getElementsByClassName('footer_news_unit')[i].href = `./news/content?id=${response.items[i].sys.id}`;
        } 
    }).catch(console.error);
    /*homeページ*/
    if (document.querySelector('.action_loading') != null) {
        resolve();
    }
}

function set_cookie(){ const cookie = document.cookie.split(";");
    for (let i = 0; i < cookie.length; i++) {
        /*cookie: anyba_home_visitedの有無判定*/ 
        if (cookie[i] == 'anyba_home_visited=true'){ 
            /*600s = 10minだけ有効なCookie発行*/ 
            document.cookie = "anyba_home_visited=true; max-age=" + 600;
            return false;
        } 
    } 
    document.cookie = "anyba_home_visited=true;max-age=" + 600;
    return true;
}

function action_home(){
    /*anime()に繰り返し処理を使用しているため、仮想的なタイムライン処理を目的に.then()チェインを組んでいます*/
    return new Promise((resolve) => {
        for (let i = 0; i < 180; i++) { 
            const el = document.createElement('div');
            el.classList.add('dots');
            document.querySelector('.action_loading').appendChild(el);
            document.getElementsByClassName('dots')[i].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.getElementsByClassName('dots')[i].style.opacity = 0;
        } 
        for (let i = 0; i < document.querySelectorAll('.loading_title').length; i++) { 
            document.querySelectorAll('.loading_title')[i].innerHTML = document.querySelectorAll('.loading_title')[i].innerText.replace(/[^\x00-\x80]|(\w)/g, "<span>$&</span>");
        } 
        document.querySelectorAll('.loading_title')[0].style.opacity = 1;
        /*img退場から文字出現→移動まで*/
        const ani = anime.timeline({
            targets: '.loading_img', 
            easing: 'easeInOutSine', 
            opacity: 0, 
            duration: 300, 
            complete: () => { 
                document.getElementsByClassName('loading_title')[0].style.opacity = 1;
            }
        }).add({ 
            targets: '.loading_title span', 
            easing: 'easeOutBack', 
            translateX: -20, 
            translateY: -50, 
            opacity: 1, 
            duration: 500, 
            delay: function(el, index) { 
                return (index * 55)
            }, 
        }).add({ 
            targets: '.loading_title', 
            easing: 'easeOutBack', 
            translateY: 100, 
            duration: 500, 
            complete: () => {
                resolve()
            },
        });
    }).then(() => {
        /*色変化 & dotアニメーション実行*/ 
        document.querySelector('.action_loading').style.backgroundColor = '#ffffff';
        document.querySelector('.loading_title').style.color = '#2b2b2b';
        document.querySelector('.loading_logo').style.opacity = 1;
        for (let i = 0; i < 100; i++) { 
            document.getElementsByClassName('dots')[i].style.opacity = 1;
            anime({ 
                targets: document.getElementsByClassName('dots')[i], 
                easing: 'easeOutExpo', 
                translateX: (Math.random() * (wmax + 1 - wmin)) + wmin, 
                translateY: (Math.random() * (hmax + 1 - hmin)) + hmin,
                scale: 0, 
                duration: 1800,
            });
        }
    }).then(() => {
        /*loading削除*/
        const ani = anime.timeline({ 
            targets: '.action_loading', 
            easing: 'linear', 
            opacity: 0, 
            duration: 500, 
            delay: 1000, 
            complete: () => { 
                document.querySelector('.action_loading').remove();
                document.body.style.overflow = 'scroll';
            }
        }).add({
            targets: '.top',
            easing: 'easeOutSine',
            opacity: 1,
            duration: 1000,
        }, 0);
    }).catch((e) => {
        console.log(e);
    });
} 
    
function action_no_home(){ 
    window.addEventListener('load', () => { 
        const ani = anime.timeline({ 
            targets: '.action_loading', 
            easing: 'linear', 
            opacity: 0, 
            duration: 500, 
            delay: 1000, 
            complete: () => { 
                document.querySelector('.action_loading').remove();
                document.body.style.overflow = 'scroll';
            } 
        }).add({ 
            targets: '.top', 
            easing: 'easeOutSine', 
            opacity: 1, 
            duration: 1000, 
        }, 0);
    });
}

document.querySelector('.nav_toggle').addEventListener('click', () => { 
    document.querySelector('.nav_toggle').style.pointerEvents = 'none';
    if (toggle.menu === false){ 
        toggle.menu = true;
        document.querySelector('.nav_toggle img').src = './img/anyba_square_orange.png';
        anime.timeline({ 
            targets: '.nav_wall', 
            easing: 'easeOutBack', 
            scale: 50, 
            duration: 1200 
        }, 0).add({ 
            targets: '.nav_toggle', 
            easing: 'linear', 
            backgroundColor: '#fff', 
            rotate: 180, 
            duration: 200, 
            complete: () => { 
                document.querySelector('.navigation').style.display = 'block';
                document.querySelector('.nav_toggle').style.pointerEvents = 'auto';
            } 
        });
 } else {
     toggle.menu = false;
     document.querySelector('.nav_toggle img').src = './img/anyba_square_white.png';
     document.querySelector('.navigation').style.display = 'none';
     document.querySelector('.nav_img').style.display = 'block';
     anime.timeline({ 
        targets: '.nav_toggle', 
        easing: 'linear', 
        backgroundColor: '#fbb03b', 
        rotate: 0, 
        duration: 200
    }).add({ 
        targets: '.nav_wall', 
        easing: 'easeOutSine', 
        top: '84%', 
        left: '72.99vw', 
        scale: 1, 
        duration: 300, 
        complete: () => { 
            document.querySelector('.nav_toggle').style.pointerEvents = 'auto';
        }
    });
}
});

document.querySelector('#wrapper').addEventListener('scroll', () => {
    if ((window.innerWidth > 1025) && (document.getElementById('wrapper').scrollTop > 1600)) {
        anime({
            targets: '.nav_bg',
            easing: 'linear',
            opacity: 1,
            duration: 100
        });
    } else if ((window.innerWidth > 1025) && (document.getElementById('wrapper').scrollTop < 1600)) {
        anime({
            targets: '.nav_bg',
            easing: 'linear',
            opacity: 0,
            duration: 100
        });
    }
});