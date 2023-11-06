var map, wmsLayer, tileLayer, info;
var toProjection = 'EPSG:900913';

map = new ol.Map(
    {
        projection: toProjection,
        target: 'map_container',
        view: new ol.View(
            {
                center: ol.proj.fromLonLat([-75.145, 40]),
                zoom: 11
            })
    }
)

//切片图层
tileLayer = new ol.layer.Tile(
    {
        source: new ol.source.XYZ(
            {
                attributions: "Data copyright OpenStreetMap contributors",
                zoom: 18,
                url: 'http://localhost/Philadelphia/tile/{z}/{x}/{y}.png',
            }
        )
    }
)

//WMS图层
wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS(
        {
            url: 'http://localhost:8080/geoserver/webgis/wms',
            params: {
                LAYERS: 'webgis:FarmersMarkets',
            }
        }
    )
})

map.addLayer(tileLayer);
map.addLayer(wmsLayer);

//信息弹窗
info = new ol.Overlay({
    element: document.getElementById('info'),
    autoPan: true
})

map.addOverlay(info);

var info_content = document.getElementById('info_content')

//点击事件
map.on('click', e => {
    var url = wmsLayer.getSource().getFeatureInfoUrl(
        e.coordinate, map.getView().getResolution(), toProjection,
        { 'INFO_FORMAT': 'application/json' }
    );

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(json => {
            var features = json.features;
            if (features != null) {
                if (features.length !== 0) {
                    //点击在WMS图层的点上时
                    var properties = features[0].properties;
                    info_content.innerText = "Name: " + properties.NAME + '\n' + '\n' + "Address: " + properties.ADDRESS;
                    info.setPosition(e.coordinate);
                } else {
                    info.setPosition(undefined);
                }
            }
        })
});

//信息弹窗关闭按钮
var closer = document.getElementById('closer')
closer.onclick = () => info.setPosition(undefined)


