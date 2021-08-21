var options = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), // 기본 위치에요
    zoom: 6,
    scaleControl: false, // 스케일 컨트롤을 삭제해요
};

var map = new naver.maps.Map('map-view', options); // 맵을 출력해요

// Mark
naver.maps.Event.addListener(map, 'tap, click', function(e) { // 지도의 어떤 위치를 클릭시, 그 위치에 마커를 표시해요
    var mark = new naver.maps.Marker({
        map: map,
        // 기본 마커는 없에고, 현재 위치만 표시하고, 현재 위치로 레이아웃을 잡아요!!!
        icon: {
            content: '<div class="mark"></div>',
            anchor: new naver.maps.Point(10, 10) // 마커를 생성시 커서의 위치에 맞게 생성되요
        }
    });

    var markLatLng = e.latlng;
    mark.setPosition(markLatLng);

    if(mark.getMap()) {
        naver.maps.Event.addListener(mark, 'doubletap, dblclick', function(e) {
            mark.setMap(null);
        });

        naver.maps.Event.addListener(mark, 'tap, click', function(e) {
            map.setCenter(new naver.maps.LatLng(markLatLng));
        });
    }
});

// zomm btn
var nowZoom = map.getZoom(); // 기본 값은 기본 줌 레벨값

naver.maps.Event.addListener(map, 'zoom_changed', function (zoom) {
    nowZoom = zoom;
});


document.getElementById("zoom-plus-btn").onclick = function() {
    if (nowZoom != 21) {
        nowZoom += 1;
    }

    map.setZoom(nowZoom, true)
};

document.getElementById("zoom-min-btn").onclick = function () {
    if (nowZoom != 6) {
        nowZoom = nowZoom - 1;
    }

    map.setZoom(nowZoom, true)
};