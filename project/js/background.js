$(document).ready(function () {
    whale.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        saveColor('1', '#asdasd000');
        loadColor('1');
        let url = tab.url;
        if (url !== undefined && changeInfo.status == "complete") {
            // 여러번 디스패치되기 때문에 리스너가 자주 호출됨
            let backOfUrl = url.split('github.com/')[1];

            if (backOfUrl.length > 0) {
                if (backOfUrl.split('/')[1] === undefined) {
                    // Profile
                    paint();
                } else {
                    // Repository
                }
            }
        }
    });
});

function paint() {
    for (let i = 0; i < 5; i++) {
        $('.contrib-legend .legend li').eq(4 - i).css('background-color', '#ffffff');
    }
}

function saveColor(key, val) {
    whale.storage.local.set({key: val}, () => {

    });
}

function loadColor(key) {
    whale.storage.local.get(key, result => {
        alert('load complete');
        alert(result[0]);
    });
}
