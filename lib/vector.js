function vector3d(x, y, z) {
    this.x = x|0;
    this.y = y|0;
    this.z = z|0;
}

function vector2d(x, y) {
    this.x = x|0;
    this.y = y|0;
}

exports.vector2d = vector2d;
exports.vector3d = vector3d;
