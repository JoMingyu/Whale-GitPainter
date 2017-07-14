$(document).ready(function() {
    whale.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        let url = tab.url;
        if(url !== undefined && changeInfo.status == "complete") {
            // 여러번 디스패치되기 때문에 리스너가 자주 호출됨
            alert("changed");
        }
    });
});
