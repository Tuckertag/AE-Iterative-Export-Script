var win = new Window("palette", "Iterate and Export", undefined);
win.orientation = "column";

var iterationProperty = win.add("group");
iterationProperty.add("statictext", undefined, "Selected Property");
iterationProperty.alignment = "left";
var propertyInput = iterationProperty.add("edittext", undefined ,"enter valid property");
propertyInput.preferredSize.width = 300;

var operationPanel = win.add("panel", undefined, "Iteration Type");
operationPanel.orientation = "row";
operationPanel.alignment = "left";
var operatorLabel = operationPanel.add("statictext", undefined, "Operation:");
var operatorDropdown = operationPanel.add("dropdownlist", undefined, ["Add", "Subtract", "Multiply", "Divide"]);
operatorDropdown.selection = 0;

var valuePanel = operationPanel.add("group", undefined);
valuePanel.orientation = "row";
valuePanel.alignment = "left";
var valueLabel = valuePanel.add("statictext", undefined, "By:");
var valueInput = valuePanel.add("edittext", undefined, "1");
valueInput.characters = 5;

var pathPanel = win.add("group", undefined);
pathPanel.orientation = "row";
pathPanel.alignment = "left";
var pathLabel = pathPanel.add("statictext", undefined, "Render Path:");
var pathInput = pathPanel.add("edittext", undefined, "~/Desktop/renders");
pathInput.characters = 25;
var browseButton = pathPanel.add("button", undefined, "Browse");

var outputLabel = win.add("group", undefined, "Output File Name:");
outputLabel.add("statictext", undefined, "Name from:");
outputLabel.orientation = "row";
outputLabel.alignment = "left";
var outputName = outputLabel.add("edittext",undefined,"~desktop/file.csv");
outputName.characters = 25;
var csvBrowseButton = outputLabel.add("button", undefined, "Browse");

var columnPanel = win.add("group", undefined);
columnPanel.orientation = "row";
columnPanel.alignment = "left";
var columnLabel = columnPanel.add("statictext", undefined, "Column for Naming:");
var columnInput = columnPanel.add("edittext", undefined, "1");
columnInput.characters = 5;
var headercheckbox = columnPanel.add("checkbox", undefined, "Header row");

var formatGroup = win.add("group", undefined);
var formatDropdown = formatGroup.add("dropdownlist", undefined, ["MP4","MOV","AVI"]);
formatDropdown.selection = 0;
formatGroup.alignment = "left";

browseButton.onClick = function() {
    var selectedFolder = Folder.selectDialog("Select an existing folder.");
    if (selectedFolder) {
        pathInput.text = selectedFolder.fsName;
    }
};

csvBrowseButton.onClick = function () {
    var selectedFilePath = File.openDialog("Select a CSV file.");
    if (selectedFilePath) {
        outputName.text = selectedFilePath.fsName;
    }
};

var renderButton = win.add("button", undefined, "Render");
renderButton.alignment = "right";

win.show();

// UI Script ^^ //

// Function Scripts vv //

renderButton.onClick = function() {

// pre-conditional variables //

    var selectedFilePath = outputName.text;
    var selectedFile = new File(selectedFilePath);
    var namingCollumn = parseInt(columnInput.text) - 1;
    var comp = app.project.activeItem;
    var value = parseFloat(valueInput.text);
    var operation = operatorDropdown.selection.text;
    var renderQueue = app.project.renderQueue;
    var renderPath = pathInput.text;

// error conditioning //
if(selectedFile){
    if (comp && comp instanceof CompItem && comp.selectedLayers.length > 0) {
        var layer = comp.selectedLayers[0];
        
        try {

// post-conditional variables_1 //

            var propertyString = propertyInput.text; 
            var property = eval("layer." + propertyString);
            if(selectedFile.open("r")){
                var content = selectedFile.read();
         }
         selectedFile.close();

         var lines = content.split("\n");
         var headings = [];
         var data = [];
         if(headercheckbox === true){
            var totalRows = lines.length - 1;
         }else{
            var totalRows = lines.length;
         }
         for (var i = 0; i< lines.length; i++){
            var line = lines[i];
            if (line === 0 && headercheckbox.value){
                headings = line.split(",");
            }else{
                var record = line.split(",");
                data.push(record);
            }
        }
            
// iterate //

            for (var i = 0; i < totalRows; i++) {
            if (property instanceof Property) {
                var currentValue = property.value;
                
                if (typeof currentValue === "number") {

// render function //

                    renderQueue.items.add(comp);

                    var renderItem = renderQueue.item(renderQueue.numItems);
                    var outputModule = renderItem.outputModule(1);
                    var record = data[i]
                    if(i+1<10){
                        var fileName = "0" + i+1 + " " + record[namingCollumn];
                    }else{
                        var fileName = i+1 + " " + record[namingCollumn];
                    }
                    var filePath = renderPath + "/" + fileName;

                    switch (formatDropdown.selection.text) {
                        case "MP4":
                            outputModule.file = File(filePath + ".mp4");
                            outputModule.applyTemplate("H.264 - Match Render Settings - 15 Mbps");
                            break;
                        case "MOV":
                            outputModule.file = File(filePath + ".mov");
                            outputModule.applyTemplate("High Quality with Alpha");
                            break;
                        case "AVI":
                            outputModule.file = File(filePath + ".avi");
                            outputModule.applyTemplate("Lossless with Alpha");
                            break;
                        default:
                            alert("Invalid format selected.");
                        return;
                    }

// render //                    

                    app.project.renderQueue.render();

// iteration function //

                    switch (operation) {
                        case "Add":
                            property.setValue(currentValue + value);
                            break;
                        case "Subtract":
                            property.setValue(currentValue - value);
                            break;
                        case "Multiply":
                            property.setValue(currentValue * value);
                            break;
                        case "Divide":
                            property.setValue(currentValue / value);
                            break;
                    }

// errors //

                } else {
                    alert("The selected value is not a number and cannot be incremented.");
                }
            } else {
                alert("Please enter a valid property. i.e. transform.opacity");
            }
        }
        } catch (err) {
            alert("ERROR: " + err.message);
        }
    } else {
        alert("Please have a layer selected.");
    }
}
    else {
        alert("Please select a valid file.");
    }
};
