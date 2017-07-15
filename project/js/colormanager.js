let contribColors = ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

function loadContribColors() {
    whale.storage.sync.get('contrib', items => {
        alert(items);

        if (items === undefined) {
            
        } else {

        }
    });
}

function changeContribColor(position, colorCode) {
    whale.storage.sync.set({'position': position, 'code': code}, () => {
        
    });
}

whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
    for(let i = 0; i < 5; i++) {
        $('.contrib-legend .legend li').eq(i).css('background-color', contribColors[i]);
    }
});
