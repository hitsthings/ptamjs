var matrixMult = require('./math').matrixMult;
var matrix = require('./struct').floatMatrix;


var pic = matrix(4,1);

/**
 * takes in a set of camera parameters
 * @returns a function for converting camera coordinates into "image" coordinates -
 * that is, the location of the point in the camera's resulting image
 * 
 * In variable-speak, it can be called with Ecw and piw to return a point pi
 * 
 * pic = Ecw * piw
 * Ecw : the translation & rotation matrix for converting
 *       world coordinates into camera coordinates
 * piw : the point in world-coordinates
 * pic : the same point in camera-centred coordinates
 * pi  : the same point in image coordinates
 *
 * @param fu the focal length of the camera, horizontally
 * @param fv the focal length of the camera, vertically
 * @param u0 the x-value of the principal point of the camera
 * @param v0 the y-value of the principal point of the camera
 * @param w  the radial (barrel) distortion for the camera.
 */
function CamProj(camera) {
    var fu = camera.fu;
    var fv = camera.fv;
    var u0 = camera.u0;
    var v0 = camera.v0;
    var w  = camera.w;

    var tan2halfW = 2 * Math.tan(w/2);

    /**
     * @param Ecw matrix_t - 4rx4c
     * @param piw matrix_t - 4rx1c
     * @return pi matrix_t - 2rx1c
     */
    return function(Ecw, piw) {

        matrixMult(Ecw, piw, pic);

        var x = pic.data[0], y = pic.data[1], z = pic.data[2];

        var r = Math.sqrt( ((x*x) + (y*y))  /  (z*z) );
        var r1 =  Math.atan(r * tan2halfW)/w;
        var r1_over_r = r1 / r;

        var pi_mat = matrix(2, 1);
        pi_mat.set_data([fu * r1_over_r * x / z + u0,
                         fv * r1_over_r * y / z + v0]);

        return pi_mat;
    };
}



