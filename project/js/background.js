$(document).ready(function () {
    whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        let url = tab.url;
        if (url !== undefined && changeInfo.status == "complete") {
            // 여러번 디스패치되기 때문에 리스너가 자주 호출됨
            let backOfUrl = url.split('github.com/')[1];

            if (backOfUrl.length > 0) {
                if (backOfUrl.split('/')[1] === undefined) {
                    // Profile
                    whale.tabs.query({active: true, currentWindow: true}, tabs => {
                        whale.tabs.sendMessage(tabs[0].id, {}, response => { });
                    });
                } else {
                    // Repository
                }
            }
        }
    });
});
