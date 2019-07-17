$(document).ready(function () {
    // global variable
    let body = $('body');
    let isHackerRank = (/https:\/\/www.hackerrank.com\/(.)*/gi).test(document.URL);

    // list of all tabs to be displayed
    let tabs = [];

    class tab {
        constructor(id, name, listItem, html) {
            this.id = id;
            this.name = name;
            this.listItem = listItem;
            this.html = html;
        }

        createTabsFromList() {
            if (this.listItem != null) {
                let link = '<li><a id="tabName-' + this.id + '" href="#tabs-' + this.id + '">' + this.name + '</a></li>';
                let content = createContent(listItem);
            }
        }

        createTabsFromHtml() {
            if (this.html != null) {
                let link = '<li class="nav-item"><a class="nav-link" id="tabName-' + this.id + '"  data-toggle="tab" role="tab" href="#tabs-' + this.id + '">' + this.name + '</a></li>';
                let content = '<div class="tab-pane"  id="tabs-' + this.id + '" role="tabpanel">' + this.html + '</div>';
                $('#myContent ul').append(link);
                $('#myContent .tab-content').append(content);
            }
        }
    }

    // Adding default tool to tabs list
    function pushSeparateToolToTabs() {
        let toolHtml = `<div class="col-12 form-group">
        <label for="text">Paste list number title here like 1.1.1 and 1.1.2</label>
        <textarea id="text" class="form-control"  rows="5"></textarea>
        <br>
    </div>

    <div class="col-12 form-group">
        <label for="text1">Output level 1</label>
        <textarea id="text1" class="form-control" rows="5"></textarea>
        <br>
    </div>

    <div class="col-12 form-group">
        <label for="text2">Output level 2</label>
        <textarea id="text2" class="form-control" rows="5"></textarea>
        <br>
    </div>

    <div class="col-12 form-group">
        <label for="text3">Output level 3</label>
        <textarea id="text3" class="form-control" rows="5"></textarea>
        <br>
    </div>`;

        let newTab = new tab(tabs.length + 1, "Separate Tool", null, toolHtml);
        tabs.push(newTab);
    }

    // Handle separate title number tool
    function handleSeparateTool() {
        let textInput = $('textarea#text');
        let textSplit = '';

        let outPutTextarea1 = $('textarea#text1');
        let outPutTextarea2 = $('textarea#text2');
        let outPutTextarea3 = $('textarea#text3');

        let textToOut1 = '';
        let textToOut2 = '';
        let textToOut3 = '';



        textInput.on('paste', function (e) {
            navigator.clipboard.readText().then(clipText => {
                textSplit = clipText.split('\n');
                pasteTo1();
                pasteTo2();
                pasteTo3();

            });


        });

        function pasteTo1() {
            textSplit.forEach(element => {
                if ((/^\d+\s/).test(element)) {
                    textToOut1 += element + '\n';
                }
            });
            outPutTextarea1.val(textToOut1);
        }

        function pasteTo2() {

            textSplit.forEach(element => {

                if ((/^\d+\.\d\s/).test(element)) {

                    textToOut2 += element + '\n';
                }
            });
            outPutTextarea2.val(textToOut2);
        }

        function pasteTo3() {

            textSplit.forEach(element => {

                if ((/^\d+\.\d+\.\d+\s/).test(element)) {

                    textToOut3 += element + '\n';
                }
            });
            outPutTextarea3.val(textToOut3);

        }
    }


    // Handle HackerRank website
    function handleHackerRank() {




        let fileInputName = $('#input_file_name');
        $(window).scroll(function () {
            let challengeCard = $('h4.challengecard-title').text();
            // check if the url contain funix-lab that will treat the first regex and else
            let title = challengeCard.replace((/(funix-lab)/gi).test(document.URL) ? /((\s{3,})|(\n))/gm
                : /(Hard)?(Medium)?(Easy)?Max\s(\w*\D){7}/gm, "\n");
            console.log("challengecard: " + challengeCard);
            console.log("title separeated by new line: " + title);

            fileInputName.text(title);
            $('#numberLine').val(fileInputName.val().trim().split("\n").length);

            console.log("challenge card text: " + challengeCard);
            console.log("files Title: " + title);
        });

        fileInputName.mouseleave(function () {
            $('#numberLine').val($('#input_file_name').val().trim().split("\n").length);
        });

        $("#btnSeparate").click(function (e) {
            e.preventDefault();
            let fileNames = $('#input_file_name').val().trim();
            let editor = $('#editor');
            let fileNameExtension = $("#input_file_Extension").val();
            let startNumber = $("#input_start_number").val();
            let listName = fileNames.split("\n");
            let listTextAreaId = listName.slice(0);

            if (fileNames.length === 0) {
                alert("Please input file's name");
                return;
            }

            for (let i = 0; i < listName.length; i++) {
                let number = Number(startNumber) + i;
                listName[i] = number + "_" + listName[i].replace(/\s+/g, "_") + fileNameExtension;
            }

            (function () {
                let output = "";
                for (let i = 0; i < listName.length; i++) {
                    output += `<div class="row-count col-12 form-group"> 
                    <label for="" class="title">` + listName[i] + `</label>
                    <textarea id="editorText"  class="` +
                        listTextAreaId[i].replace(/\s+/g, "") + ` form-control" rows = "5"  ></textarea >` +
                        `</div >`;
                }


                editor.html("");
                editor.append(output);
                $('#numFileToSave').val(listName.length);
                $("#btnSaveFileArea").show();
            }).call(this);

        });


        $('#btnSaveFile').click(function () {
            let rows = $('div.row-count');
            console.log("type of rows: " + typeof rows);
            let numberEmptyFile = 0;
            let zip = new JSZip();
            $.each($(rows), function (index, element) {
                let fileName = $(element).find('.title').text();
                let content = $(element).find('#editorText').val();
                if (content.length > 0) {
                    zip.file(fileName, content);
                } else {
                    numberEmptyFile++;
                }
            });


            if (numberEmptyFile < rows.length && numberEmptyFile > 0) {
                alert("There are " + numberEmptyFile + " empty, so those files would not to be zipped");
            } else if (numberEmptyFile === rows.length) {
                alert("Please input at least 1 file to zip");
                return;
            }


            zip.generateAsync({ type: "blob" }).then(
                function (blob) {
                    // 1 generate the zip file
                    let userName = $('span.username').text() || $('span.profile-username').text();
                    saveAs(blob, userName.length === 0 ? "sourcecode.zip" : userName + ".zip"); // 2) trigger the download
                },
                function () {
                }
            );
        });

        // setTimeout(function () {

        //     let listRecognizeEditor = ['#codeshell-wrapper', '.codeeditor-view', '.code-editor-section split'];
        //     let containEditor = false;
        //     let editorRecognize = null;
        //     for (let i = 0; i < listRecognizeEditor.length; i++) {
        //         const ele = listRecognizeEditor[i];
        //         if (body.find($(ele)).length > 0) {
        //             containEditor = true;
        //             editorRecognize = listRecognizeEditor[i];
                    
        //         }
        //     }

        //     // add go to hackerRank editor button
        //     if (containEditor) {
        //         let hackerRankEditorHref = "";
        //         hackerRankEditorHref = document.URL;
        //         const editorURL = hackerRankEditorHref + editorRecognize;
        //         body.append(`
        //               <a id="goToEditor" href="`+ editorURL + `" class="nav-item btn btn-success fas fa-code"></a>
        //                `);
        //     } else {
        //         $('#goToEditor').remove();
        //     }

        // }, 4000);

    }
    // This append some ui to context web page
    function loadContent() {
        // this link supplys some icon from fontawesome website
        $('head').append(`
       <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
        integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        `);

        // append default ui
        if (body.find($('#myContent')).length === 0) {
            let mainUI = `<div id="myContent" class="draggable ui-widget-content">
            <div class="btn btn-success fab fa-hackerrank" id="toggle"></div>
            <div id="tabs" class="resizable"  style="display: none;">
                <ul class="nav nav-tabs text-dark" role="tablist"> 
                </ul>
                <div class="tab-content" ></div>
            </div>
        </div>`;
            body.prepend(mainUI);
        }
        // if url match hackerRank web site, adding this tab to tabs list
        if (isHackerRank) {
            let hackerRankhtml = `<div class="col-12">
                <textarea id="input_file_name" class="form-control" rows="6"
                    placeholder="Enter all your file's name here, separated by new line">
                    </textarea>

            </div>
            <div class="col-12">
                <div class="col-12">
                    <span>Select file's Extension</span>
                </div>
                <div class="col-12">
                    <select id="input_file_Extension" class="form-control " required="required">
                        <option value=".sql">.sql</option>
                        <option value=".java">.java</option>
                        <option value=".py">.py</option>
                        <option value=".txt">.text</option>
                        <option value=".xml">.xml</option>
                        <option value=".js">.js</option>
                        <option value=".h">.h</option>
                        <option value=".cs">.cs</option>
                    </select>
                </div>
            </div>
            <div class="col-12">
                <div class="col-md-6">
                    <span>Input start number</span>
                </div>
                <div class="col-md-6">
        
                    <input type="number" id="input_start_number" class="form-control" value="1"></div>
            </div>
            <div class="col-12">
                <button id="btnSeparate" class="btn btn-success ">Separate</button>
            </div>
            <div id="floatArea" class="form-group draggable col-12">
                <input type="number" class="form-control" id="numberLine" data-toggle="tooltip"
                    title="Number line of Input Name Area !" disabled>
                <small id="helpId" class="form-text text-muted">Lines in the first form</small>
                <div id="btnSaveFileArea" style="display: none;">
                    <input type="number" class="form-control" id="numFileToSave" data-toggle="tooltip"
                        title="Number of Files to save !" disabled>
                    <small id="helpId" class="form-text text-muted">Files to be</small>
                    <div id="btnSaveFile">Saved</div>
                </div>
        
            </div>
            <div class="col-12" id="editor"></div>
            
            `;

            let newTab = new tab(tabs.length + 1, "HackerRank", null, hackerRankhtml);
            tabs.push(newTab);
        }
        // adding tool tab to tabs list which is tool help separating links number title
        pushSeparateToolToTabs();
    }

    // After pushing all tab to list tab, Display to context
    function updateUI() {
        // for each tab in tabs display them
        tabs.forEach(tab => {
            tab.createTabsFromHtml();
            tab.createTabsFromList();
        });

        if (isHackerRank) {
            // handle on event on HackerRank website
            handleHackerRank();

        }
        // handle separate tool event on website        
        handleSeparateTool();
    }

    // this will check document and load neccessary content to memory
    loadContent();
    // this displays content to context
    updateUI();



    // Behavior Event, jqueryui 
    $('.draggable').draggable();
    $('#myContent li:first-child a').tab('show');
    // make tab resizable
    $('.resizable').resizable();
    // toggle when click on hackerRank button icon embeded on website
    $('#toggle').dblclick(function () {
        $('#tabs').toggle("slow/400/fast");
    });
    $('[data-toggle="tooltip"]').tooltip();

});




