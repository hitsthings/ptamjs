function Keyframe(cameraPose, imagePyramid) {
    // Camera-centered coordinate frame
    this.cameraPose = cameraPose;

    // 4-level pyramid of 8-bit grayscale camera image data:
    // 0 : 640 x 480
    // 1 : 320 x 240
    // 2 : 160 x 120
    // 3 : 80 x 60 
    this.imageDataPyramid = imagePyramid;
}

module.exports = Keyframe;
