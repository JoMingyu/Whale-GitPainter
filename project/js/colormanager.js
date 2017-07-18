let originColors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
let contribColors = new Array(5);
let repoColor;

function loadColors(cb) {
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

function loadRepoColor(cb) {
    whale.storage.sync.get(undefined, items => {
        repoColor = items[5];
        cb();
    });
}

function saveColor(position, colorCode) {
    whale.storage.sync.set({ [position]: colorCode }, () => {
        // 컨트리뷰트 컬러는 zero-based numbering 방식으로 5개(0~4)
        // 레포 컬러는 position 5로 두도록 함
        // https://stackoverflow.com/questions/11692699/chrome-storage-local-set-using-a-variable-key-name
    });
}

whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
    loadContribColors(() => {
        changeLegend();
        changeCalendar();
    });

    loadRepoColor(() => {
        changePinnedRepoColor();
    });

    function changeLegend() {
        for (let i = 0; i < 5; i++) {
            $(`.contrib-legend .legend li:eq(${i})`).css('background-color', contribColors[i]);
        }
    }

    function changeCalendar() {
        let originGraph = $('div.js-calendar-graph svg g g');
        for (let i = 0; i < originGraph.length; i++) {
            let rects = $(`div.js-calendar-graph svg g g:nth-child(${i + 1}) rect`);
            for (let j = 0; j < rects.length; j++) {
                let rect = rects.eq(j);
                let index = originColors.indexOf(rect.attr('fill'));
                rect.attr('fill', contribColors[index]);
            }
        }
    }

    function changePinnedRepoColor() {
        if (repoColor === undefined) {
            return;
        } else {
            for (let i = 0; i < 6; i++) {
                $(`.repo.js-repo:eq(${i})`).css('color', repoColor);
            }
        }
    }
});
