# Canvas Motion Detection

In this demo we grab a video stream via [getUserMedia](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia) and render it onto a [canvas context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). The canvas is flipped to mirror the user. A second canvas context is used to render the motion detection frames. At each frame (via [requestanimationframe](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)) each color channel is converted to either black or white and we subtract each color channel from the previous frame, which gives us pixels that have changed (white pixels). We check if those pixels are within the area of the the notes on top of the screen and highlight them, as if we are touching them.

![](https://github.com/miguelmota/canvas-motion-detection/blob/master/demo.gif)

# Demo

[http://lab.moogs.io/canvas-motion-detection](http://lab.moogs.io/canvas-motion-detection)

# License

MIT
