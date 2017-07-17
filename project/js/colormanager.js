let contribColors = ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

function loadContribColors(cb) {
    whale.storage.sync.get(undefined, items => {
        for (let i = 1; i <= 5; i++) {
            let colorCode = items[i.toString()];
            if (colorCode !== undefined) {
                contribColors[i - 1] = colorCode;
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
    });
});
