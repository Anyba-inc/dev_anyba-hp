(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
    })
})();
const toggle = {
    menu: false,
};
const client = contentful.createClient({
    space: '0ur8wylaqiku',
    accessToken: 'HeyjUfBwQufqQD3ox1RM9ZmXiSF_UW4YPCQlqFyy07w',
});
function init(){
    window.innerWidth < 1025 ? document.querySelector('.nav_img img').src = 'https://anyba.jp/img/anyba_side_white.png' : '';
    client.getEntries({
        limit: 3
    }).then((response) => {
        for (let i = 0; i < response.items.length; i++) {
            //footerニュース単体のタイトル更新
            if ((response.items[i].fields.title != undefined) || (response.items[i].fields.title != null)){
                if (response.items[i].fields.title.length >= 43) {
                    document.getElementsByClassName('footer_news_title')[i].innerHTML = response.items[i].fields.title.slice(0, 43) + '…';
                } else {
                    document.getElementsByClassName('footer_news_title')[i].innerHTML = response.items[i].fields.title;
                }
            } else {
                document.getElementsByClassName('footer_news_title')[i].innerHTML = '新しいニュース';
            }
            //footerニュース単体の公開時期更新
            if ((response.items[i].fields.date != undefined) || (response.items[i].fields.date != null)){
                document.getElementsByClassName('footer_news_date')[i].innerHTML = response.items[i].fields.date.split('T')[0].replace(/-/g,'.');
            } else {
                document.getElementsByClassName('footer_news_date')[i].innerHTML = '';
            }
            //footerニュース単体のサムネイル更新
            if ((response.items[i].fields.headerImage != undefined) || (response.items[i].fields.headerImage != null)){
                document.getElementsByClassName('footer_news_img')[i].src = response.items[i].fields.headerImage.fields.file.url;
            } else {
                document.getElementsByClassName('footer_news_img')[i].src = '../img/anyba_side_news.png';
            }
            //footerニュース単体のhref更新
            document.getElementsByClassName('footer_news_unit')[i].href = `../news/content?id=${response.items[i].sys.id}`;
        }
    }).catch(console.error);
}
document.querySelector('.nav_toggle').addEventListener('click', () => {
    document.querySelector('.nav_toggle').style.pointerEvents = 'none';
    if (toggle.menu === false){
        toggle.menu = true;
        document.querySelector('.nav_toggle img').src = '../img/anyba_square_orange.png';
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
        document.querySelector('.nav_toggle img').src = '../img/anyba_square_white.png';
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
    if ((window.innerWidth > 1025) && (document.getElementById('wrapper').scrollTop > 200)) {
        anime({
            targets: '.nav_bg',
            easing: 'linear',
            opacity: 1,
            duration: 100
        });
    } else if ((window.innerWidth > 1025) && (document.getElementById('wrapper').scrollTop < 200)) {
        anime({
            targets: '.nav_bg',
            easing: 'linear',
            opacity: 0,
            duration: 100
        });
    }
});