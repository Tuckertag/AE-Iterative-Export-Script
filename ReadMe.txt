Hi there!
Thank you for downloading this script!

To run in Adobe After Effects, go to:
	File > Scripts > Run Script File > Iterate and Export (RQ or AME)

RQ - Renders native in Adobe After Effects.
AME - Sends your files to Adobe Media Encoder to render.

This script will render your active After Effects composition multiple times, while updating a single property by a specified amount.
This is a very specific script I wrote to help out with a project. I made it interactable in case anyone else has the same need that I once did. I used this script to render iterations of a linked .csv file, and didn't want to pay the $20 - $200 for any of the existing plug-ins. so please mind the limited capabilities of this script, it is free.

How to Use:
Once the UI panel opens, you'll be faced with 5 input options -
1. Selected Property - In this text box, you will enter the property you would like this script to run on. For example - effect("Slider Control")("Slider") - This will run the 			apply the iteration function to the slider controller on the selected layer.
2. Iteration Type - Here, you have the option to add, subtract, multiply or divide, and by how much.
3. Number of Steps - This number chooses how many times you will render each file.
4. Render Path - Here, you can manually type in a render path, or select the browse button to select your designated folder output.
5. Output File Name - Lastly, you can name your final file here. If you are rendering native in After Effects, you also have the choice between MP4, MOV, or AVI videos.

Render / Send to Media Encoder Buttons -
	Once you finish inputting your designated values, you will hit the button in the bottom right of the panel.
	Render - Renders directly in the Adobe After Effects Render Queue, using the video presets Adobe has.
	Send to Media Encoder - Sends each iteration to Adobe Media Encoder without rendering. There, users will be able to adjust file format, compression, or anything 					else that fits your output needs.