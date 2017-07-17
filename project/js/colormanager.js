let originColors = ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let contribColors = new Array(5);

function loadContribColors(cb) {
    whale.storage.sync.get(undefined, items => {
        for (let i = 0; i < 5; i++) {
            let colorCode = items[i];
            if (colorCode !== undefined) {
                contribColors[i] = colorCode;
            } else {
                contribColors[i] = originColors[i];
            }
        }

        cb();
    });
}

function changeContribColor(position, colorCode) {
    whale.storage.sync.set({ [position]: colorCode }, () => {
        // https://stackoverflow.com/questions/11692699/chrome-storage-local-set-using-a-variable-key-name
    });
}

whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
    loadContribColors(() => {
        for (let i = 0; i < 5; i++) {
            $('.contrib-legend .legend li').eq(i).css('background-color', contribColors[i]);
        }

        let originGraph = $('div.js-calendar-graph > svg > g g');
        for (let i = 0; i < originGraph.length; i++) {
            let rects = $(`div.js-calendar-graph > svg > g > g:nth-child(${i + 1}) rect`);
            for(let rect; rect < rects; rect++) {
                let origin = $(`div.js-calendar-graph > svg > g > g:nth-child(${i + 1}) > rect:nth-child(${rect + 1})`);
            }
        }
    });
});
