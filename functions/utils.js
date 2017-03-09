var utils = {}

function format(source, params) {
    for (var i=0; i< params.length; i++) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), params[i]);
    }
    return source;
}

module.exports = utils