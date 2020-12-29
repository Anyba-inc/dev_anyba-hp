(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();
const releaseClient = contentful.createClient({
    space: '0ur8wylaqiku',
    accessToken: 'HeyjUfBwQufqQD3ox1RM9ZmXiSF_UW4YPCQlqFyy07w',
});
const outMediaClient = contentful.createClient({
    space: 'aoxkogmp7hli',
    accessToken: 'j_t7MeEignNZJt8-apoMtM3RFZDknDT30yd6icAlkN4',
});
const toggle = {
    menu: false,
};
let device = 0;
const NEWS_PARAMETERS = [
    //PC表示パラメータ
    {
        release: 6,
        outmedia: 7
    },
    //タブレット・スマートフォン表示パラメータ
    {
        release: 3,
        outmedia: 5
    },
];


const empty = {sys: {id: '', updatedAt: null}, fields: {body: '', date: '', headerImage: {fields: {file: {url: ''}, }, }, link: '', title: '', }, };
function init(){
    window.history.pushState(null, null, './');
    //デバイス判定 画面横幅が1025px未満の場合、deviceに1(true)をセット
    device = window.innerWidth < 1025 ? 1 : 0;
    window.innerWidth < 1025 ? document.querySelector('.nav_img img').src = 'https://anyba.jp/img/anyba_side_white.png' : '';
    //自社ニュース用セグメント生成
    releaseClient.getEntries().then((response) => {
        const num = response.items.length / NEWS_PARAMETERS[device].release;
        for (let i = 0; i < response.items.length / NEWS_PARAMETERS[device].release; i++) {
            const a = document.createElement('a');
            a.setAttribute('class', `news_segment_release`);
            a.setAttribute('onclick', `reload_release(${i + 1})`);
            a.textContent = i + 1;
            if (i === 0){a.classList.add(`news_segment_release_active`);}
            document.querySelector('.news_release .news_segment_list').appendChild(a);
        }
    }).catch(console.error);
    //外部掲載ニュース用セグメント生成
    outMediaClient.getEntries().then((response) => {
        const num = response.items.length / NEWS_PARAMETERS[device].outmedia;
        for (let i = 0; i < response.items.length / NEWS_PARAMETERS[device].outmedia; i++) {
            const a = document.createElement('a');
            a.setAttribute('class', `news_segment_media`);
            a.setAttribute('onclick', `reload_media(${i + 1})`);
            a.textContent = i + 1;
            if (i === 0){a.classList.add(`news_segment_media_active`);}
            document.querySelector('.news_media .news_segment_list').appendChild(a);
        }
    }).catch(console.error);
    //自社ニュースの取得
    releaseClient.getEntries({
        limit: NEWS_PARAMETERS[device].release
    }).then((response) => {
        for (let i = 0; i < response.items.length; i++) {
            document.getElementsByClassName('news_unit_link')[i].style.pointerEvents = 'auto';
            document.getElementsByClassName('news_unit_img')[i].style.display = 'block';
            //ニュース単体のタイトル更新
            if ((response.items[i].fields.title != undefined) || (response.items[i].fields.title != null)){
                if (response.items[i].fields.title.length >= 45) {
                    document.getElementsByClassName('news_unit_title')[i].innerHTML = response.items[i].fields.title.slice(0, 45) + '…';
                } else {
                    document.getElementsByClassName('news_unit_title')[i].innerHTML = response.items[i].fields.title;
                }
            } else {
                document.getElementsByClassName('news_unit_title')[i].innerHTML = '新しいニュース';
            }
            //ニュース単体の公開時期更新
            if ((response.items[i].fields.date != undefined) || (response.items[i].fields.date != null)){
                document.getElementsByClassName('news_unit_date')[i].innerHTML = response.items[i].fields.date.split('T')[0].replace(/-/g,'.');
            } else {
                document.getElementsByClassName('news_unit_date')[i].innerHTML = '';
            }
            //ニュース単体のサムネイル更新
            if ((response.items[i].fields.headerImage != undefined) || (response.items[i].fields.headerImage != null)){
                document.getElementsByClassName('news_unit_img')[i].src = response.items[i].fields.headerImage.fields.file.url;
            } else {
                document.getElementsByClassName('news_unit_img')[i].src = '../img/anyba_side_news.png';
            }
            //ニュース単体のhref更新
            document.getElementsByClassName('news_unit_link')[i].href = `./content?id=${response.items[i].sys.id}`;
        }
    }).catch(console.error);
    //外部掲載ニュースへのリンク、及びタイトルと日時の取得
    outMediaClient.getEntries({
        limit: NEWS_PARAMETERS[device].outmedia
    }).then((response) => {
        for (let i = 0; i < response.items.length; i++) {
            //ニュース単体のタイトル更新
            if ((response.items[i].fields.title != undefined) || (response.items[i].fields.title != null)){
                if (response.items[i].fields.title.length >= 45) {
                    document.getElementsByClassName('news_list_title')[i].innerHTML = response.items[i].fields.title.slice(0, 45) + '…';
                } else {
                    document.getElementsByClassName('news_list_title')[i].innerHTML = response.items[i].fields.title;
                }
            } else {
                document.getElementsByClassName('news_list_title')[i].innerHTML = '新しいニュース';
            }
            document.getElementsByClassName('news_list_title')[i].setAttribute('class', 'news_list_title_active');
            //ニュース単体の公開時期更新
            if ((response.items[i].fields.date != undefined) || (response.items[i].fields.date != null)){
                document.getElementsByClassName('news_list_date')[i].innerHTML = response.items[i].fields.date.split('T')[0].replace(/-/g,'.');
            } else {
                document.getElementsByClassName('news_list_date')[i].innerHTML = '';
            }
            //ニュース単体の公開時期更新
            if ((response.items[i].fields.link != undefined) || (response.items[i].fields.link != null)){
                document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'auto';
                document.getElementsByClassName('news_list_link')[i].href = response.items[i].fields.link;
            } else {
                document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'none';
            }
        }
    }).catch(console.error);
}


function reload_release(num){
    const t = num - 1;
    document.getElementsByClassName('news_segment_release_active')[0].classList.remove('news_segment_release_active');
    document.getElementsByClassName('news_segment_release')[num - document.getElementsByClassName('news_segment_release')[0].innerHTML].classList.add('news_segment_release_active');
    

    //news_release >> news_unit_link内の情報をそれぞれ更新
    releaseClient.getEntries({
        skip: NEWS_PARAMETERS[device].release * t
    }).then((response) => {
        const arr = response.items;
        const dif = arr.length % NEWS_PARAMETERS[device].release;
        for (let i = 0; i < (NEWS_PARAMETERS[device].release - dif); i++) {arr.push(empty)}
        for (let i = 0; i < NEWS_PARAMETERS[device].release; i++) {
            if ((arr[i].sys.updatedAt != null) || (arr[i].sys.updatedAt != undefined)){
                document.getElementsByClassName('news_unit_link')[i].style.pointerEvents = 'auto';
                document.getElementsByClassName('news_unit_img')[i].style.display = 'block';
                //footerニュース単体のタイトル更新
                if ((arr[i].fields.title != undefined) || (arr[i].fields.title != null)){
                    if (response.items[i].fields.title.length >= 45) {
                        document.getElementsByClassName('news_unit_title')[i].innerHTML = arr[i].fields.title.slice(0, 45) + '…';
                    } else {
                        document.getElementsByClassName('news_unit_title')[i].innerHTML = arr[i].fields.title;
                    }
                } else {
                    document.getElementsByClassName('news_unit_title')[i].innerHTML = '新しいニュース';
                }
                //footerニュース単体の公開時期更新
                if ((arr[i].fields.date != undefined) || (arr[i].fields.date != null)){
                    document.getElementsByClassName('news_unit_date')[i].innerHTML = arr[i].fields.date.split('T')[0].replace(/-/g,'.');
                } else {
                    document.getElementsByClassName('news_unit_date')[i].innerHTML = '';
                }
                //footerニュース単体のサムネイル更新
                if ((arr[i].fields.headerImage != undefined) || (arr[i].fields.headerImage != null)){
                    document.getElementsByClassName('news_unit_img')[i].src = arr[i].fields.headerImage.fields.file.url;
                } else {
                    document.getElementsByClassName('news_unit_img')[i].src = '../img/anyba_side_news.png';
                }
                //footerニュース単体のhref更新
                document.getElementsByClassName('news_unit_link')[i].href = `./content?id=${arr[i].sys.id}`;
            } else {
                document.getElementsByClassName('news_unit_link')[i].style.pointerEvents = 'none';
                document.getElementsByClassName('news_unit_title')[i].innerHTML = '';
                document.getElementsByClassName('news_unit_date')[i].innerHTML = '';
                document.getElementsByClassName('news_unit_img')[i].style.display = 'none';
            }
        }
    }).catch(console.error);
    NEWS_PARAMETERS[device].release === 3 ? document.documentElement.scrollTop = document.getElementsByClassName('news_release')[0].getBoundingClientRect().top + window.pageYOffset * 0.96 : '';
}
function reload_media(num){
    const t = num - 1;
    document.getElementsByClassName('news_segment_media_active')[0].classList.remove('news_segment_media_active');
    document.getElementsByClassName('news_segment_media')[num - document.getElementsByClassName('news_segment_media')[0].innerHTML].classList.add('news_segment_media_active');
    

    //news_release >> news_unit_link内の情報をそれぞれ更新
    outMediaClient.getEntries({
        skip: NEWS_PARAMETERS[device].outmedia * t
    }).then((response) => {
        const arr = response.items;
        const dif = arr.length % NEWS_PARAMETERS[device].outmedia;
        for (let i = 0; i < (NEWS_PARAMETERS[device].outmedia - dif); i++) {arr.push(empty)}
        for (let i = 0; i < NEWS_PARAMETERS[device].outmedia; i++) {
            //sys >> updateAtパラメータを利用して、配列の要素にデータが存在するかどうかを判別
            if ((arr[i].sys.updatedAt != null) || (arr[i].sys.updatedAt != undefined)){
                document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'auto';
                //footerニュース単体のタイトル更新
                if ((arr[i].fields.title != undefined) || (arr[i].fields.title != null)){
                    if (response.items[i].fields.title.length >= 45) {
                        document.getElementsByClassName('news_list_title')[i].innerHTML = arr[i].fields.title.slice(0, 45) + '…';
                    } else {
                        document.getElementsByClassName('news_list_title')[i].innerHTML = arr[i].fields.title;
                    }
                } else {
                    document.getElementsByClassName('news_list_title')[i].innerHTML = '新しいニュース';
                }
                //footerニュース単体の公開時期更新
                if ((arr[i].fields.date != undefined) || (arr[i].fields.date != null)){
                    document.getElementsByClassName('news_list_date')[i].innerHTML = arr[i].fields.date.split('T')[0].replace(/-/g,'.');
                } else {
                    document.getElementsByClassName('news_list_date')[i].innerHTML = '';
                }
                //footerニュース単体の公開時期更新
                if ((arr[i].fields.link != undefined) || (arr[i].fields.link != null)){
                    document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'auto';
                    document.getElementsByClassName('news_list_link')[i].href = arr[i].fields.link;
                } else {
                    document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'none';
                }
            } else {
                document.getElementsByClassName('news_list_link')[i].style.pointerEvents = 'none';
                document.getElementsByClassName('news_list_title')[i].innerHTML = '';
                document.getElementsByClassName('news_list_date')[i].innerHTML = '';
            }
        }
    }).catch(console.error);
    NEWS_PARAMETERS[device].release === 3 ? document.documentElement.scrollTop = document.getElementsByClassName('news_media')[0].getBoundingClientRect().top + window.pageYOffset * 0.96 : '';
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
    } else if ((window.innerWidth > 1025) && (document.getElementById('wrapper').scrollTop < 500)) {
        anime({
            targets: '.nav_bg',
            easing: 'linear',
            opacity: 0,
            duration: 100
        });
    }
});