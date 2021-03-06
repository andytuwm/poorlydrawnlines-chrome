window.onload = function () {
    "use strict";
    // New XHR object to get data from xkcd
    var oReq = new XMLHttpRequest();
    // Variables to store comic numbers to keep track of which is displayed.
    var displayedComicIndex = null,
        endIndex = null,
        archiveList = null,
        latestComic = null,
        firstComic = null,
        comicTitle = null,
        currentUrl = null,
        expanded = false,
        spinCount = 1,
        historyNeedsUpdate = true,
        hist = [];

    // Retrieve history from chrome.storage.sync on start.
    // Set saved history array for data binding.
    chrome.storage.sync.get('browsed', function (array) {
        if (array.browsed) {
            hist = array.browsed;
            loadHistory();
        }
    });

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
    var search = document.getElementById("searchinput");
    var menuItemGetter = document.getElementById('historyMenu');
    var historyButton = document.getElementById('hist-button');
    var expand = document.getElementById('expand');

    first.onload = first.addEventListener("click", getFirst, false);
    prev.onload = prev.addEventListener("click", getPrevious, false);
    rand.onload = rand.addEventListener("click", getRandom, false);
    next.onload = next.addEventListener("click", getNext, false);
    last.onload = last.addEventListener("click", getLast, false);
    image.onload = image.addEventListener("click", openComic, false);
    search.onload = search.addEventListener("keyup", searchComic, false);
    menuItemGetter.onload = menuItemGetter.addEventListener("click", restoreComic, false);
    historyButton.onload = historyButton.addEventListener("click", loadHistory, false);
    expand.onload = expand.addEventListener("click", expandComic, false);
    image.onerror = imgError;

    // Populates title and image, sets the current comic from the response
    function reqListener() {
        //displayedComicIndex = this.response.num;
        comicTitle = this.response.title.replace(/Poorly Drawn Lines(\s\W\s)/i, "");
        //console.log(comicTitle);

        var displayNum = endIndex - displayedComicIndex;
        document.getElementById("comicTitle").innerHTML = comicTitle;
        document.getElementById("comicNumber").innerHTML = "#" + displayNum;
        image.src = ""; //ensure old comic doesn't flash for a split second
        image.src = this.response.querySelector('.post img').src;
        image.title = comicTitle;

        // Update history here (on load of comic) so that the comic that user closes
        // extension on will be saved too.
        update(hist);
        // Deactivate loading spinner
        image.style.opacity = 1;
        document.querySelector('.mdl-spinner').classList.remove('is-active');
        // On expand, ensure image is shown at top.
        if (expanded)
            document.getElementById('image').scrollTop = 0;
    }

    //Store archive of comics
    function setup() {
        // get archive of comics
        archiveList = this.response.querySelector('.content > ul').children;
        //console.log(archiveList);

        // set endpoint parameters
        displayedComicIndex = 0;
        endIndex = archiveList.length - 1;
        latestComic = archiveList[0].firstChild.href;
        firstComic = archiveList[endIndex].firstChild.href;
        //console.log(latestComic, firstComic, displayedComicIndex, endIndex);

        // set most recent comic
        new Promise(function (resolve) {
            setComic(latestComic);
            image.onload = function () {
                resolve();
            };
        }).then(function () {
            // fade in the expand button after image is loaded
            expand.style.WebkitAnimation = 'fadeIn 0.5s ease-in 1 forwards';
        });

    }

    // Send HTTP request and retrieve info of the comic from specified url
    function setComic(url) {
        // transition to loading spinner
        image.style.opacity = 0;
        document.querySelector('.mdl-spinner').classList.add('is-active');
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
        if (displayedComicIndex !== endIndex) {
            displayedComicIndex = endIndex;
            setComic(firstComic);
        } else {}
        //                document.getElementById("end").show();
    }

    // Get previous comic
    function getPrevious() {
        if (displayedComicIndex + 1 <= endIndex) {
            displayedComicIndex += 1;
            setComic(getComicUrl(displayedComicIndex));
        } else {}
        //                document.getElementById("end").show();
    }

    // Get random comic
    function getRandom() {
        if (spinCount === 1) {
            rand.style.WebkitAnimation = "fullSpin 0.7s ease-out";
            spinCount++;
        } else {
            rand.style.WebkitAnimation = "fullSpin2 0.7s ease-out";
            spinCount--;
        }
        displayedComicIndex = Math.floor((Math.random() * endIndex));
        setComic(getComicUrl(displayedComicIndex));
    }

    // Get next comic
    function getNext() {
        if (displayedComicIndex - 1 >= 0) {
            displayedComicIndex -= 1;
            setComic(getComicUrl(displayedComicIndex));
        } else {}
        //                document.getElementById("end").show();
    }

    // Get most recent comic
    function getLast() {
        if (displayedComicIndex !== 0) {
            displayedComicIndex = 0;
            setComic(latestComic);
        } else {}
        //                document.getElementById("end").show();
    }

    // Makes a search query for the comic number specified
    function searchComic() {
        if (window.event.keyCode === 13) {
            var comicSearch = search.value;
            if (comicSearch.match(/[a-z]/i) || !comicSearch.match(/[0-9]+/)) {
                //                    document.getElementById("badinput").show();
            } else if (endIndex - comicSearch === displayedComicIndex) {
                //                    document.getElementById("already").show();
            } else if (comicSearch >= 0 && comicSearch <= endIndex) {
                displayedComicIndex = endIndex - comicSearch;
                setComic(getComicUrl(displayedComicIndex));
            } else {
                //                    document.getElementById("badnum").show();
            }
            // Clear search text input field
            search.value = "";
        }
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
        var title = comicTitle;
        var stored = {
            com: displayedComicIndex,
            disp: title
        };

        // Store history as a map of (comic number: displayed title).
        if (!historyContains(history, displayedComicIndex)) {

            if (history.length < 10) {
                history.push(stored);
            } else {
                history.shift();
                history.push(stored);
            }
            hist = history;
            //console.log(history);

        } else {
            var index = findIndex(history, displayedComicIndex);
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
            historyNeedsUpdate = true;
        });
    }

    function restoreComic() {
        // Grab index of menu item clicked
        var comicIndex = event.target.dataset.indexcount;
        // Grab stored comic number from history queue
        displayedComicIndex = hist[comicIndex].com;
        setComic(getComicUrl(displayedComicIndex));
    }

    // Check if comic num is already in history.
    function historyContains(jsonArray, num) {
        if (jsonArray) {
            for (var i = 0; i < jsonArray.length; i++) {
                if (jsonArray[i].com == num) {
                    return true;
                }
            }
        }
        return false;
    }

    function loadHistory() {
        if (historyNeedsUpdate && hist.length > 0) {
            var item;
            var oldChild = document.getElementById('histList');
            var newChild = document.createElement("div");
            newChild.id = "histList";
            for (var i = 0; i < hist.length; i++) {
                item = document.createElement("li");
                item.classList.add("mdl-menu__item");
                item.innerHTML = hist[i].disp;
                item.setAttribute("data-indexcount", i);
                newChild.appendChild(item);
            }
            document.getElementById("historyMenu").replaceChild(newChild, oldChild);
            historyNeedsUpdate = false;
        }
    }

    // Return index of the specified comic in history; if not found, return -1.
    function findIndex(jsonArray, num) {
        if (jsonArray) {
            for (var i = 0; i < jsonArray.length; i++) {
                if (jsonArray[i].com == num) {
                    return i;
                }
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

    // Expand or minimize comic
    function expandComic() {
        if (!expanded) {
            document.getElementById('image').style.overflowY = 'scroll';
            image.style.maxHeight = 'none';
            expand.style.WebkitAnimation = "spin 0.3s ease-in-out 1 forwards";
            expand.style.opacity = '1';
            expanded = true;
        } else {
            document.getElementById('image').style.overflowY = 'hidden';
            image.style.maxHeight = '450px';
            expand.style.WebkitAnimation = "spinBack 0.3s ease-in-out 1 forwards";
            expanded = false;
        }
    }

};