# Canvas Motion Detection

In this demo we grab a video stream via [getUserMedia] and render it onto a canvas context. At each frame we subtract the color channels from the previous frame which gives pixels that have changed. We check if those pixels are within the area of the the notes on top and highlight them, as if we are touching them.

![](https://github.com/miguelmota/canvas-motion-detection/blob/master/demo.gif)

# Demo

[http://lab.moogs.io/canvas-motion-detection](http://lab.moogs.io/canvas-motion-detection)

# License

MIT
