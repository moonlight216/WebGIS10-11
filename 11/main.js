var map, tileLayer;

map = new ol.Map(
    {
        projection: 'EPSG:900913',
        target: 'map_container',
        view: new ol.View(
            {
                center: ol.proj.fromLonLat([-75.145, 40]),
                zoom: 11
            }
        )
    }
)

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

map.addLayer(tileLayer);


//gardens
const gardensLayer = new ol.layer.Vector({
    title: 'gardens',
    source: new ol.source.Vector({
        projection: 'EPSG:900913',
        url: 'gardens.geojson',
        format: new ol.format.GeoJSON()
    }),
    //默认样式
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 4,
            color: '#B04173'
        }),
        fill: new ol.style.Fill({
            color: '#ff00ff'
        })
    })
})

const selectGardens = new ol.interaction.Select({
    layers: [gardensLayer],
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 4,
            color: '#0000ff'
        }),
        fill: new ol.style.Fill({
            color: '#00fffb'
        })
    })

})
map.addInteraction(selectGardens);


//pantries
const pantriesLayer = new ol.layer.Vector({
    title: 'pantries',
    source: new ol.source.Vector({
        projection: 'EPSG:900913',
        url: 'pantries.geojson',
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'pantries.svg',
            imgSize: [25, 25],
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 1 / 29
        })
    })
})

const selectPantries = new ol.interaction.Select({
    layers: [pantriesLayer],
    style: new ol.style.Style({
        image: new ol.style.Icon({
            src: 'pantries_selected.svg',
            imgSize: [25, 25],
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: 1 / 29
        })
    })

})
map.addInteraction(selectPantries);

//改变<p>标签内容
map.on('click', e => {
    var pixel = map.getEventPixel(e.originalEvent);
    let flag = true;//点击在要素点上为false
    map.forEachFeatureAtPixel(pixel, feature => {
        var featureName = feature.getProperties().name || "无名称要素";
        console.log()
        document.getElementById('docs').innerHTML = '<p style="font-size:18px"><b>' + featureName + '</b></p>';
        flag = false;
    });
    if (flag) {
        document.getElementById('docs').innerHTML = '<p>点击地图中的公园或食品店获取更多信息</p>';
    }
});

map.addLayer(gardensLayer)
map.addLayer(pantriesLayer)
