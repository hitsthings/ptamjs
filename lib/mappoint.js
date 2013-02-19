var vector3d = require('./vector').vector3d;

function MapPoint() {
    // location in the world coordinate system
    this.point = new vector3d();

    // normal of the patch in world coordinate system
    this.normal = new vector3d();


    // the first keyframe in which this feature was recognized
    this.sourceKeyframe = null;
    
    // the pyramid level in the kyeframe where this feature was recognized
    this.sourcePyramidLevel = 0;

    // the location of the top-left pixel of the 8x8 patch in the pyramid level that this MapPoint represents
    this.pixelLocation = new Vector2d(0, 0);
}
