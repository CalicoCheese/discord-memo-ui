export function log(namespace, message, color) {
    if (color == undefined) {
        color = "#FFCC4D";
    }

    if (console != undefined) {
        // eslint-disable-next-line
        console.log(`%c[${namespace}]`, `color: ${color}`, message);
    }
}
