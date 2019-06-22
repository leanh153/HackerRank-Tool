$(document).ready(function () {
    // Inject to Website
    let body = $('body');
    $('head').append(`
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
    integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    `);

    function loadUI() {
        if (body.find($('#myContent')).length === 0) {
            let mainUI = `<div id="myContent" class="draggable ui-widget-content">
    <div class="btn btn-success fab fa-hackerrank" id="toggle"></div>
    <div id="tabs" style="display: none;">
        <ul>
            <li><a id="tabName" href="#tabs-1">HackerRank</a></li>
        </ul>
        <div class="resizable tabContent" id="tabs-1">
            <div class="col-12">
            <textarea id="input_file_name" class="form-control"
                      rows="6" placeholder="Enter all your file's name here, separated by new line">
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
        </div>
    </div>
</div>`;
            body.prepend(mainUI);

        }

        handleHackerRank();

    }

    loadUI();


    function handleHackerRank() {
        let pageTitle = $('h1.page-label').text();
        let fileInputName = $('#input_file_name');
        $('#myContent').find('a').text(pageTitle);
        $(window).scroll(function () {
            let challangeCard = $('h4.challengecard-title').text();
            let title = challangeCard.replace(/(Hard)?(Medium)?(Easy)?Max\s(\w*\D){7}/gm, "\n");
            fileInputName.text(title);
            $('#numberLine').val(fileInputName.val().trim().split("\n").length);
            console.log("files Title: " + title);
        });

        fileInputName.mouseleave(function () {
            $('#numberLine').val($('#input_file_name').val().trim().split("\n").length);
        });


        // handle hacker rank
        $("#btnSeparate").click(function (e) {
            e.preventDefault();
            let fileNames = $('#input_file_name').val().trim();
            if (fileNames.length === 0) {
                alert("Please input file's name");
                return;
            }

            let fileNameExtension = $("#input_file_Extension").val();
            let startNumber = $("#input_start_number").val();
            let listName = fileNames.split("\n");
            let listTextAreaId = listName.slice(0);
            for (let i = 0; i < listName.length; i++) {
                let number = Number(startNumber) + i;
                listName[i] = number + ". " + listName[i].replace(/\s+/g, "_") + fileNameExtension;
            }
            generateEditor();
            $("#btnSaveFileArea").show();

            function generateEditor() {
                let output = "";
                for (let i = 0; i < listName.length; i++) {
                    output =
                        output + "<div class='row-count'>" +
                        "<p class = 'col-12 title'>" + listName[i] + "</p>" +
                        "<div class='col-12'>" +
                        "<textarea id='editorText'  class='" + listTextAreaId[i].replace(/\s+/g, "") + " form-control' rows = '4'  ></textarea >" +
                        "</div ></div>";

                }

                let editor = $('#editor');

                editor.html("");
                editor.append(output);
                $('#numFileToSave').val(listName.length);

            }
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


            zip.generateAsync({type: "blob"}).then(
                function (blob) {
                    // 1 generate the zip file
                    let userName = $('span.username').text();
                    saveAs(blob, userName.length === 0 ? "sourcecode.zip" : userName + ".zip"); // 2) trigger the download
                },
                function () {
                }
            );
        });

    }

    // Behavior Event
    $('.draggable').draggable();
    $('#tabs').tabs();
    $('.resizable').resizable();
    $('#toggle').dblclick(function () {
        $('#tabs').toggle("slow/400/fast");
    });
    $('[data-toggle="tooltip"]').tooltip();

});




