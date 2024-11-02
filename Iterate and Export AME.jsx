var win = new Window("palette", "Iterate and Export", undefined);
win.orientation = "column";

var iterationProperty = win.add("group");
iterationProperty.add("statictext", undefined, "Selected Property");
iterationProperty.alignment = "left";
var propertyInput = iterationProperty.add("edittext", undefined, "enter valid property");
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

var stepsPanel = win.add("group", undefined);
stepsPanel.orientation = "row";
stepsPanel.alignment = "left";
var stepsLabel = stepsPanel.add("statictext", undefined, "Number of steps:");
var stepsInput = stepsPanel.add("edittext", undefined, "10");
stepsInput.characters = 5;

var pathPanel = win.add("group", undefined);
pathPanel.orientation = "row";
pathPanel.alignment = "left";
var pathLabel = pathPanel.add("statictext", undefined, "Render Path:");
var pathInput = pathPanel.add("edittext", undefined, "~/Desktop/renders");
pathInput.characters = 25;
var browseButton = pathPanel.add("button", undefined, "Browse");

var outputLabel = win.add("group", undefined, "Output File Name:");
outputLabel.add("statictext", undefined, "Output File Name:");
outputLabel.orientation = "row";
outputLabel.alignment = "left";
var outputName = outputLabel.add("edittext",undefined,"file name");
outputName.preferredSize.width = 100;

browseButton.onClick = function() {
    var selectedFolder = Folder.selectDialog("Select an existing folder.");
    if (selectedFolder) {
        pathInput.text = selectedFolder.fsName;
    }
};

var renderButton = win.add("button", undefined, "Send to Media Encoder");
renderButton.alignment = "right";

win.show();

// UI Script ^^ //

// Function Scripts vv //

renderButton.onClick = function() {

// pre-conditional variables //

    var comp = app.project.activeItem;
    var value = parseFloat(valueInput.text);
    var operation = operatorDropdown.selection.text;
    var steps = parseFloat(stepsInput.text);
    var renderQueue = app.project.renderQueue;
    var fileName = outputName.text;
    var renderPath = pathInput.text;

// open AME //

    var bt = new BridgeTalk();

// error conditioning //
    if(BridgeTalk.isRunning("ame")) {
    if (comp && comp instanceof CompItem && comp.selectedLayers.length > 0) {
        var layer = comp.selectedLayers[0];
        
        try {

// post-conditional variables_1 //

            var propertyString = propertyInput.text; 
            var property = eval("layer." + propertyString);
            
// iterate //

            for (var i = 0; i < steps; i++) {
            if (property instanceof Property) {
                var currentValue = property.value;
                
                if (typeof currentValue === "number") {

// render function //

                    renderQueue.items.add(comp);

                    var renderItem = renderQueue.item(renderQueue.numItems);
                    var outputModule = renderItem.outputModule(1);
                    var filePath = renderPath + "/" + fileName + "_" + (i + 1);
                    outputModule.file = File(filePath);

// send to AME //                    

                    app.project.renderQueue.queueInAME(false);

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
                    $.sleep(1500);

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
    } else {
        BridgeTalk.launch("ame","background");
        alert("Please run once Media Encoder has launched.");
    } 
};
