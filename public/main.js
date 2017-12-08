var downX = null;
var downY = null;

var video = null;
var gestureLayer = null;

var cursor = null;
var actionAble = false;

var guides = null;


document.addEventListener("DOMContentLoaded", function (event) {
    //do work
    gestureLayer = document.getElementById("gesture-layer");

    gestureLayer.addEventListener('mousedown', onDown);
    gestureLayer.addEventListener('mousemove', onMove);
    gestureLayer.addEventListener('mouseup', onUp);

    gestureLayer.addEventListener('touchstart', onTouchDown);
    gestureLayer.addEventListener('touchmove', onTouchMove);
    gestureLayer.addEventListener('touchend', onTouchEnd);


    video = document.getElementById('my-video');
    // 此处不能使用lambda () => 结构的表示闭包，因为iOS 9及以下不支持。
    video.addEventListener('durationchange', function() {
        guides = data;
        restoreData(window.screen.width, window.screen.height, video.duration)
        try {
            // iOS
            webkit.messageHandlers.playable.postMessage('readyToPlay');

            // Android
            window.android.startVideo();
        } catch (err) {
            console.log(`The client hasn't "android.startVideo()" function or "playable.readyToPlay" event.`);
        }
    })
});

function restoreData(screenWidth, screenHeight, videoDuration) {
    if (videoDuration == Infinity) {
        return;
    }

    if (!guides) return;
    for (var i = 0; i < guides.length; i++) {
        var csr = guides[i];
        csr.span.start *= videoDuration;
        csr.span.loopStart *= videoDuration;
        csr.span.end *= videoDuration;
        csr.event[0].block[0] *= screenWidth;
        csr.event[0].block[1] *= screenHeight;
        csr.event[0].block[2] *= screenWidth;
        csr.event[0].block[3] *= screenHeight;
        csr.passed = false;
    }
}

refreshFrame();

function refreshFrame() {
    requestAnimationFrame(refreshFrame);
    if (!video || !guides) return;
    var ct = video.currentTime;
    for (var i = 0; i < guides.length; i++) {
        var cs = guides[i];
        if (cs.span.start <= ct && ct < cs.span.end) {
            cursor = cs;
        }
    }

    if (!cursor || cursor.passed) return;

    if (ct > cursor.span.end) {
        if (cursor.span.start == cursor.span.loopStart) {
            video.currentTime = cursor.span.end;
            video.pause();
        } else {
            video.currentTime = cursor.span.loopStart;
        }
    }
}

function onClicked() {
    log('click')
    if (actionAble && !cursor.passed && cursor.event[0].action[4]) {
        passCursor();
    }
}

function onSwipeLeft() {
    if (actionAble && !cursor.passed && cursor.event[0].action[3]) {
        passCursor();
    }
}

function onSwipeUp() {
    if (actionAble && !cursor.passed && cursor.event[0].action[1]) {
        passCursor();
    }
}

function onSwipeRight() {
    if (actionAble && !cursor.passed && cursor.event[0].action[5]) {
        passCursor();
    }
}


function onSwipeDown() {
    if (actionAble && !cursor.passed && cursor.event[0].action[7]) {
        passCursor();
    }
}

function passCursor() {
    video.currentTime = cursor.span.end;
    video.play();
    cursor.passed = true;
}

function onDown(e) {
    downX = e.clientX;
    downY = e.clientY;

    if (!cursor) return;

    var rect = cursor.event[0].block;
    if (rect[0] < downX && downX < rect[2] && rect[1] < downY && downY < rect[3]) {
        actionAble = true;
    } else {
        actionAble = false;
    }
}

function onMove(e) {
    if (!downX || !downY) {
        return;
    }

    var upX = e.clientX;
    var upY = e.clientY;

    var deltaX = downX - upX;
    var deltaY = downY - upY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            onSwipeLeft();
            resetDwonXY();
        } else {
            onSwipeRight();
            resetDwonXY();
        }
    } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
        if (deltaY > 0) {
            onSwipeUp();
            resetDwonXY();
        } else {
            onSwipeDown();
            resetDwonXY();
        }
    }
}

function onUp(e) {
    var upX = e.clientX;
    var upY = e.clientY;
    if (upX == downX && upY == downY) {
        onClicked();
    }
    resetDwonXY();
}

function onTouchDown(e) {
    onDown(e.touches[0])
    e.preventDefault();
}

function onTouchMove(e) {
    onMove(e.touches[0]);
    e.preventDefault();
}

function onTouchEnd(e) {
    if (e.touches.length == 0) onUp(e.changedTouches[0]);
}

function resetDwonXY() {
    downX = null;
    downY = null;
}

function log(msg) {
    document.getElementById('info').innerHTML = msg;
}