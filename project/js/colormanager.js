let contribColors = ['#eee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

function loadContribColors() {
    whale.storage.sync.get(undefined, items => {
        for (let i = 1; i <= 5; i++) {
            let colorCode = items[i.toString()];
            if (colorCode !== undefined) {
                contribColors[i - 1] = colorCode;
            }
        }
    });
}

function changeContribColor(position, colorCode) {
    //// logic
    whale.storage.sync.set({ [position]: colorCode }, () => {
        // https://stackoverflow.com/questions/11692699/chrome-storage-local-set-using-a-variable-key-name
    });

    //// junk
    // whale.storage.sync.get(undefined, items => {
    //     alert(items[position]);
    // });
}

whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //// junk
    // changeContribColor(1, '#ccccasdasdf');

    //// logic
    // for(let i = 0; i < 5; i++) {
    //     $('.contrib-legend .legend li').eq(i).css('background-color', contribColors[i]);
    // }
});
