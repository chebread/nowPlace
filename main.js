var options = {
    center: new naver.maps.LatLng(37.3595704, 127.105399), // 기본 위치에요
    zoom: 6,
    scaleControl: false, // 스케일 컨트롤을 삭제해요
};

var map = new naver.maps.Map('map-view', options); // 맵을 출력해요

// 현재 위치 마커
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

        $("#current-position-btn").click(() => {
            map.setCenter(nowPosition);
            map.setZoom(15, true)
        })
    }, function () {
        // 위치 기능이 켜저 있지 않다면
        // 취소선을 유지한다. 그리고 현재 위치 btn을 배경을 lightgray으로 바꾼다
        $(function() {
            $("#current-position-btn").css({
                "background-color": "lightgray"
            });
        })
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

// data mark (사용자 수정 불가)
var dataMarkList = [];
var postsWindowList = [];

for (var i in data) {
    var target = data[i]; // 위도, 경도
    var dataPosition = new naver.maps.LatLng(target.lat, target.lng);
    var dataMark = new naver.maps.Marker({
        map: map,
        position: dataPosition,
        icon: {
            content: '<div class="dataMark"></div>',
            anchor: new naver.maps.Point(10, 10)
        }
    });

    var content = `
        <div class='posts-window-container'>
            <section id='posts-window-title'>
                ${target.title}
            </section>

            <section id='posts-window-content'>
                ${target.content}
            </section>

            <section id='posts-window-data'>
                ${target.data}
            </section>
        </div>
    `;

    var postsWindow = new naver.maps.InfoWindow({
        content: content,
        backgroundColor: "#00ff0000",
        borderColor: "#00ff0000",
        anchorSize: new naver.maps.Size(0, 0),
    });

    dataMarkList.push(dataMark);
    postsWindowList.push(postsWindow);
}

for (var i = 0, ii = dataMarkList.length; i < ii; i++){
    naver.maps.Event.addListener(dataMarkList[i], "click", getClickHandler(i));
}

function getClickHandler(i) {
    return function () {
        var dataMark = dataMarkList[i];
        var postsWindow = postsWindowList[i];

        
        if (postsWindow.getMap()) {
            postsWindow.close();
        } else {
            postsWindow.open(map, dataMark);
        }
    }
}

var nowZoom = map.getZoom(); // 기본 값은 기본 줌 레벨값

naver.maps.Event.addListener(map, 'zoom_changed', function (zoom) {
    nowZoom = zoom;
});


$("#zoom-plus-btn").click(() => {
    
    if (nowZoom != 21) {
        nowZoom += 1;
    }

    map.setZoom(nowZoom, true)
});

$("#zoom-min-btn").click(() => {
    if (nowZoom != 6) {
        nowZoom = nowZoom - 1;
    }

    map.setZoom(nowZoom, true)
});