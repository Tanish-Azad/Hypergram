const CANVAS = document.getElementById("canvas");
const FILE_INPUT = document.getElementById("file-input");
const BRIGHTNESS_SLIDER = document.getElementById("brightness");
const CONTRAST_SLIDER = document.getElementById("contrast");
const TRANSPARENT_SLIDER = document.getElementById("transparent");
const SAVE_BUTTON = document.getElementById("save-button");

let image = new Image();
let ctx = CANVAS.getContext("2d");

FILE_INPUT.addEventListener('change', function(ev) {
    if (ev.target.files) {
        let file = ev.target.files[0];
        let reader  = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = function (e) {
            image.src = e.target.result;
            image.onload = function() {
                CANVAS.width = image.width;
                CANVAS.height = image.height;

                ctx.drawImage(image, 0, 0);
            }
        }
    }
});

function process() {
    let brightness = parseInt(BRIGHTNESS_SLIDER.value);
    let contrast = parseInt(CONTRAST_SLIDER.value);
    let transparent = parseFloat(TRANSPARENT_SLIDER.value);

    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, CANVAS.width, CANVAS.height);
    let pixels = imageData.data;
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));

    for (let i = 3; i < pixels.length; i += 4) {
        for (let j = 1; j < 4; j++) {
            pixels[i-j] = truncate(factor * (pixels[i-j] - 128) + 128 + brightness);
        }

        pixels[i] *= transparent;
    }

    imageData.data = pixels;

    ctx.putImageData(imageData, 0, 0);
}

function truncate(value) {
    if (value < 0) {
        return 0;
    } else if (value > 255) {
        return 255;
    } else {
        return value;
    }
}

BRIGHTNESS_SLIDER.addEventListener("change", function () {process()});
CONTRAST_SLIDER.addEventListener("change", function () {process()});
TRANSPARENT_SLIDER.addEventListener("change", function () {process()});

SAVE_BUTTON.addEventListener("click", function () {
    let image = CANVAS.toDataURL();

    let tmpLink = document.createElement('a');
    tmpLink.download = 'result.png';
    tmpLink.href = image;
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
});