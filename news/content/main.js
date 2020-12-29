(() => {
    window.addEventListener('DOMContentLoaded', () => {
        init();
    });
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
    //contents本体のデータ取得
    //記事全てにsysのidで検索をかけヒットすれば表示、サムネイルがない場合はimgから代替イメージを挿入
    client.getEntries().then((response) => {
        for (let i = 0; i < response.items.length; i++) {
            if (response.items[i].sys.id === location.href.split('=')[1]) {
                document.querySelector('.contents_date').innerHTML = response.items[i].fields.date.split('T')[0].replace(/-/g,'.');
                document.querySelector('.contents_title').innerHTML = response.items[i].fields.title;
                //footerニュース単体のサムネイル更新
                if ((response.items[i].fields.headerImage != undefined) || (response.items[i].fields.headerImage != null)){
                    document.querySelector('.contents_img').src = response.items[i].fields.headerImage.fields.file.url;
                } else {
                    document.querySelector('.contents_img').src = '../../img/anyba_side_news.png';
                }
                document.querySelector('.contents_details').innerHTML = response.items[i].fields.body;
                document.querySelector('.contents_link').innerHTML = response.items[i].fields.link;
                document.querySelector('.contents_link').href = response.items[i].fields.link;
                document.title = `${response.items[i].fields.title}｜Anyba Inc.`;

                //パンクズリスト末尾にリンクとテキストを挿入
                document.querySelector('.topicpath_la_link').href = location.href;
                document.querySelector('.topicpath_la_text').innerHTML = `${response.items[i].fields.title}｜株式会社エニバ`;

                //metaデータのリンク, タイトルを書き換え
                // for (let i = 0; i < document.head.children.length; i++) {
                //     var proper = document.head.children[i].getAttribute('name');
                //     if (proper = ('twitter:site' || 'twitter:title' || 'ogTitle')){
                //         document.head.children[i].setAttribute('content', `${document.title}｜株式会社エニバ`);
                //     }
                //     if (proper = 'ogUrl'){
                //         document.head.children[i].setAttribute('content', `${location.href}`);
                //     }
                // }

                //URLをニュースIDから日付に書き換え
                // window.history.pushState(null, null, `/news?${response.items[i].fields.date.split('T')[0]}`);
            }
        }
    }).catch(console.error);
    //以下、footer内ニュース処理
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
                document.getElementsByClassName('footer_news_img')[i].src = '../../img/anyba_side_news.png';
            }
            //footerニュース単体のhref更新
            document.getElementsByClassName('footer_news_unit')[i].href = `./?id=${response.items[i].sys.id}`;
        }
    }).catch(console.error);
}
document.querySelector('.nav_toggle').addEventListener('click', () => {
    document.querySelector('.nav_toggle').style.pointerEvents = 'none';
    if (toggle.menu === false){
        toggle.menu = true;
        document.querySelector('.nav_toggle img').src = '../../img/anyba_square_orange.png';
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
        document.querySelector('.nav_toggle img').src = '../../img/anyba_square_white.png';
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