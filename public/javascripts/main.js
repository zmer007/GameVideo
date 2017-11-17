var xDown = null;
var yDown = null;

var guideData = null;

$(document).ready(function () {
    $("#gesture-layer").on("touchstart", actionDown);
    $("#gesture-layer").on("touchmove", actionMove);
    $("#gesture-layer").on("touchend", actionEnd);

    $("#game-video").click(function () {
        $("#gesture-info").text(guideData[1].span.end);
    });
});

$.getJSON("guide.json", function (data) {
    guideData = data;
})

function actionDown(event) {
    console.log(event.touches[0].clientX);
    xDown = event.touches[0].clientX;
    yDown = event.touches[0].clientY;
    event.preventDefault();
}

function actionMove(event) {
    console.log(event.touches[0].clientX);
    if (!xDown || !yDown) {
        return;
    }

    var xUp = event.touches[0].clientX;
    var yUp = event.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            onSwipeLeft(xDown, yDown);
        } else {
            onSwipeRight(xDown, yDown);
        }
    } else if(Math.abs(xDiff) < Math.abs(yDiff)){
        if (yDiff > 0) {
            onSwipeUp(xDown, yDown);
        } else {
            onSwipeDown(xDown, yDown);
        }
    }
}

function actionEnd(event) {
    var xUp = event.changedTouches[0].pageX;
    var yUp = event.changedTouches[0].pageY;
    if(xUp == xDown && yUp == yDown){
        onClicked(xDown, yDown);
    }
    xDown = null;
    yDown = null;
}

function onClicked(originX, originY){
    $("#gesture-info").text("clicked (" + originX + ", " + originY + ")");
}

function onSwipeLeft(originX, originY){
    $("#gesture-info").text("left swipe (" + originX + ", " + originY + ")");
}

function onSwipeRight(originX, originY) {
    $("#gesture-info").text("right swipe (" + originX + ", " + originY + ")");
}

function onSwipeUp(originX, originY) {
    $("#gesture-info").text("up swipe (" + originX + ", " + originY + ")");
}

function onSwipeDown(originX, originY) {
    $("#gesture-info").text("down swipe (" + originX + ", " + originY + ")");
}