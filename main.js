window.onload = function () {

    setTimeout(function () {
        // New XHR object to get data from xkcd
        var oReq = new XMLHttpRequest();
        // Variables to store comic numbers to keep track of which is displayed.
        var displayedComicIndex = null,
            endIndex = null,
            archiveList = null;
        var latestComic = null,
            firstComic = null;
        var comicTitle = null;
        var comicUrlBase = "http://poorlydrawnlines.com/comic/",
            currentUrl = null;
        var arraybind = document.getElementById('array');
        var hist = [];

        /*        // Retrieve history from chrome.storage.sync on start.
                // Set saved history array for data binding.
                chrome.storage.sync.get('browsed', function (array) {
                    hist = array.browsed;
                    arraybind.historyList = hist;
                    //console.log(arraybind.historyList);
                    //console.log(hist);
                });*/

        // Initialize comics in archive
        oReq.responseType = "document";
        oReq.onload = setup;
        oReq.open("GET", "http://poorlydrawnlines.com/archive/", true);
        oReq.send();

        // Eventlisteners for buttons
        var first = document.getElementById("first");
        var prev = document.getElementById("prev");
        var rand = document.getElementById("random");
        var next = document.getElementById("next");
        var last = document.getElementById("last");
        var image = document.getElementById("comic");
        var help = document.getElementById("explain");
        var menuItemGetter = document.getElementById('historyMenu');
        var img = document.getElementById('comic');

        first.onload = first.addEventListener("click", getFirst, false);
        prev.onload = prev.addEventListener("click", getPrevious, false);
        rand.onload = rand.addEventListener("click", getRandom, false);
        next.onload = next.addEventListener("click", getNext, false);
        last.onload = last.addEventListener("click", getLast, false);
        image.onload = image.addEventListener("click", openComic, false);
        help.onload = help.addEventListener("click", openHelp, false);
        menuItemGetter.onload = menuItemGetter.addEventListener("core-activate", restoreComic, false);
        img.onerror = imgError;



        // Populates title and image, sets the current comic from the response
        function reqListener() {
            //displayedComicIndex = this.response.num;
            comicTitle = this.response.title;
            console.log(comicTitle);

            document.getElementById("comicTitle").innerHTML = comicTitle;
            document.getElementById("comic").src = this.response.querySelector('#post img').src;
            document.getElementById("comic").title = comicTitle;

            // Update history here (on load of comic) so that the comic that user closes
            // extension on will be saved too.
            //update(hist);
        }

        //Store archive of comics
        function setup() {
            // get archive of comics
            archiveList = this.response.querySelector('#content > ul').children;
            console.log(archiveList);

            // set endpoint parameters
            displayedComicIndex = 0;
            endIndex = archiveList.length - 1;
            latestComic = archiveList[0].firstChild.href;
            firstComic = archiveList[endIndex].firstChild.href;
            console.log(latestComic, firstComic, displayedComicIndex, endIndex);

            // set most recent comic
            setComic(latestComic);
            document.getElementById("end").dismiss;
        }

        // Send HTTP request and retrieve info of the comic from specified url
        function setComic(url) {
            currentUrl = url;
            var Req = new XMLHttpRequest();
            Req.responseType = "document";
            Req.onload = reqListener;
            Req.open("GET", url, true);
            Req.send();
        }

        // Navigation functions
        // Get first comic
        function getFirst() {
            if (displayedComicIndex != endIndex) {
                displayedComicIndex = endIndex;
                setComic(firstComic);
            } else
                document.getElementById("end").show();
        }

        // Get previous comic
        function getPrevious() {
            if (displayedComicIndex + 1 <= endIndex) {
                displayedComicIndex += 1;
                setComic(getComicUrl(displayedComicIndex));
            } else
                document.getElementById("end").show();
        }

        // Get random comic
        function getRandom() {
            displayedComicIndex = Math.floor((Math.random() * endIndex));
            setComic(getComicUrl(displayedComicIndex));
        }

        // Get next comic
        function getNext() {
            if (displayedComicIndex - 1 >= 0) {
                displayedComicIndex -= 1;
                setComic(getComicUrl(displayedComicIndex));
            } else
                document.getElementById("end").show();
        }

        // Get most recent comic
        function getLast() {
            if (displayedComicIndex !== 0) {
                displayedComicIndex = 0;
                setComic(latestComic);
            } else
                document.getElementById("end").show();
        }

        // Opens a new tab to the comic's page on actual site
        function openComic() {
            chrome.tabs.create({
                url: currentUrl,
                active: false
            });
        }

        // Stores history of viewed comics as a queue of ten
        function update(history) {
            var title = displayedComic + ": " + comicTitle;
            var stored = {
                com: displayedComic,
                disp: title
            };

            // Store history as a map of (comic number: displayed title).
            if (!historyContains(history, displayedComic)) {

                if (history.length < 10) {
                    history.push(stored);
                } else {
                    history.shift();
                    history.push(stored);
                }
                arraybind.historyList = history;
                //console.log(history);

            } else {
                var index = findIndex(history, displayedComic);
                if (index > -1) {
                    var el = history.splice(index, 1);
                    history.push(el[0]);
                    //console.log(history);
                } else {
                    console.error('Error: Index should always be found if comic was found in history.');
                }
            }
            // Save history with chrome.storage.sync
            chrome.storage.sync.set({
                'browsed': history
            }, function () {
                //console.log("History saved.");
            });
        }

        function restoreComic() {
            // Grab index of menu item clicked
            var comicIndex = menuItemGetter.selectedIndex;
            //console.log(comicIndex);
            // Grab stored comic number from history queue
            var comicNum = hist[comicIndex].com;
            //console.log(comicNum);
            setComic("http://xkcd.com/" + comicNum + "/info.0.json");
            //console.log(menuItemGetter.selected);

            // Clear dropdown sticky selection
            menuItemGetter.selected = null;
        }

        // Check if comic num is already in history.
        function historyContains(jsonArray, num) {
            for (var i = 0; i < jsonArray.length; i++) {
                if (jsonArray[i].com == num) {
                    return true;
                }
            }
            return false;
        }

        // Return index of the specified comic in history; if not found, return -1.
        function findIndex(jsonArray, num) {
            for (var i = 0; i < jsonArray.length; i++) {
                if (jsonArray[i].com == num) {
                    return i;
                }
            }
            return -1;
        }

        // Return comic url given an index.
        function getComicUrl(index) {
            return archiveList[index].firstChild.href;
        }

        function imgError() {
            document.getElementById("404").show();
        }
    }, 100);
};