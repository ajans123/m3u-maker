var app = new Vue({
    el: '#app',
    data: {
        title: "",
        channels: [
            ["", ""]
        ],
        result: ""
    },
    methods: {
        add: function (index) {
            let newArr = [], channels = this.channels;
            for (let item in channels) {
                newArr.push(channels[item]);
                if (parseInt(item) === index) newArr.push(['',''])
            }
            this.channels = newArr;
        },
        move: function (type, index) {
            let newArr = [], channels = this.channels;
            if (type === "up" && index > 0) {
                console.log('test');
                for (let item in channels) {
                    if (parseInt(item) === (index - 1)) newArr.push(channels[parseInt(item) + 1]);
                    if (parseInt(item) !== index) newArr.push(channels[item]);
                }
                this.channels = newArr;
            }
            if (type === "down" && index < channels.length-1) {
                for (let item in channels) {
                    if (parseInt(item) !== index) newArr.push(channels[item]);
                    if (parseInt(item) === (index + 1)) newArr.push(channels[parseInt(item) - 1]);
                }
                this.channels = newArr;
            }
            if (type === "re") {
                for (let item in channels) if (parseInt(item) !== index) newArr.push(channels[item]);
                this.channels = newArr.length > 0 ? newArr : [['','']];
            }
        },
        importM3U: function () {
            document.getElementById('importm3u').click();
        },
        make: function () {
            this.result = '#EXTM3U\n';
            for (let item in this.channels) {
                let channelItem = this.channels[item];
                if (channelItem[0] !== "" && channelItem[1] !== "") this.result += '#EXTINF:0 group-title="' + this.title + '",' + channelItem[0] + '\n' + channelItem[1] + '\n';
            }
            setTimeout(saveTextAsFile, 1);
        }
    }
});

function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let fullPath = document.getElementById('importm3u').value;
        let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        let filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) filename = filename.substring(1);
        if (filename.includes(".m3u")) {
            let contents = e.target.result, contentArr = [];
            contents = contents.replace(/#EXTM3U/g,"");
            contents = contents.replace(/\n/g,"");
            contents = contents.split("#EXTINF:");
            for (let item in contents) {
                if (contents[item]) {
                    let contentItem = contents[item].split("http"), nameItem = contentItem[0].split("").reverse().join("");
                    nameItem = nameItem.substr(0, nameItem.search(","));
                    contentItem[0] = nameItem.split("").reverse().join("");
                    contentItem[1] = "http" + contentItem[1];
                    contentArr.push(contentItem);
                }
            }

            app._data.title = filename.replace(".m3u", "");
            app._data.channels = contentArr;
        } else alert("Please import m3u file.")
    };
    reader.readAsText(file);
}
document.getElementById('importm3u').addEventListener('change', readSingleFile, false);

function saveTextAsFile() {
    let textToWrite = document.getElementById('result').value;
    let textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    let fileNameToSaveAs = document.getElementById('title_input').value + ".m3u";
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}