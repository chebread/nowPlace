var options = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), // 기본 위치에요
    zoom: 17,
    scaleControl: false, // 스케일 컨트롤을 삭제해요
};

var map = new naver.maps.Map('map-view', options); // 맵을 출력해요

if (navigator.geolocation) { // 현재 위치 기능을 브라우저가 지원한다면 이 로직을 실행해요
    navigator.geolocation.getCurrentPosition(function (position) {
        // 위치 기능이 켜저 있다면
        // line (취소선) 을 없엔다
        $(function() {
            $("#line").css({
                "display": "none",
            });
        });

        var nowPosition = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var nowMark = new naver.maps.Marker({
            map: map,
            position: nowPosition, // 현재 위치를 받아와요
            icon: {
                content: '<div class="nowMark"></div>'
            }
        });

        map.setCenter(nowPosition); // 현재 위치를 중심으로 위치를 잡아요

        // 현재 위치 버튼을 클릭시 setCenter 해요
        if (nowMark.getMap()) {
            naver.maps.Event.addListener(nowMark, 'click', function(e) {
                map.setCenter(nowPosition);
            });
        }
    }, function () {
        // 위치 기능이 켜저 있지 않다면
        // 취소선을 유지한다. 그리고 현재 위치 btn을 배경을 lightgray으로 바꾼다
        $(function() {
            $("#current-position-btn").css({
                "background-color": "lightgray"
            });
        })

        // test current position mark logic
        var nowMark = new naver.maps.Marker({
            map: map,
            position: new naver.maps.LatLng(37.3595704, 127.105399), // 현재 위치를 받아와요
            icon: {
                content: '<div class="nowMark"></div>'
            }
        });

        map.setCenter(new naver.maps.LatLng(37.3595704, 127.105399));

        if (nowMark.getMap()) {
            naver.maps.Event.addListener(nowMark, 'tab, click', function(e) {
                map.setCenter(new naver.maps.LatLng(37.3595704, 127.105399));
            });
        }
        //
    });
} else {
    $(function() {
        $("#current-position-btn").css({
            "background-color": "lightgray"
        });
    })
}

// Mark
naver.maps.Event.addListener(map, 'tap, click', function(e) { // 지도의 어떤 위치를 클릭시, 그 위치에 마커를 표시해요
    var mark = new naver.maps.Marker({
        map: map,
        // 기본 마커는 없에고, 현재 위치만 표시하고, 현재 위치로 레이아웃을 잡아요!!!
        icon: {
            content: '<div class="mark"></div>'
        }
    });

    var markLatLng = e.latlng;
    mark.setPosition(markLatLng);

    //marker.setMap(map);
    if(mark.getMap()) { // 마커를 다시 클릭시 마커를 삭제해요!
        naver.maps.Event.addListener(mark, 'doubletap, dblclick', function(e) {
            mark.setMap(null);
        });

        naver.maps.Event.addListener(mark, 'tap, click', function(e) {
            map.setCenter(new naver.maps.LatLng(markLatLng)); // 마커를 클릭하면 마커를 중심으로 확대되요
            map.setZoom(17, true)
        });
    }
});