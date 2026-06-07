// ==========================
// MEMBUAT MAP
// ==========================

var map = L.map('map').setView([-5.43,105.26],12);



// ==========================
// BASEMAP OSM
// ==========================

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'© OpenStreetMap'
}).addTo(map);



// ==========================
// POLYGON WILAYAH
// ==========================

var wilayahLayer;

fetch('../Data/tbu tbs.geojson')

.then(response => response.json())

.then(data => {

    wilayahLayer = L.geoJSON(data, {

        style: {

            color:'#2563EB',
            weight:2,
            fillColor:'#60A5FA',
            fillOpacity:0.3

        },
        onEachFeature:function(feature,layer){

    // POPUP
    layer.bindPopup(

        "<b>Kecamatan :</b> "
        + feature.properties.WADMKC +

        "<br><b>Kelurahan :</b> "
        + feature.properties.WADMKD

    );



    // HOVER EFFECT
    layer.on({

        mouseover:function(e){

            e.target.setStyle({

                fillOpacity:0.7,
                weight:3,
                color:'#1D4ED8'

            });

        },



        mouseout:function(e){

            wilayahLayer.resetStyle(e.target);

        }

    });

}

    }).addTo(map);

    wilayahLayer.bringToBack();

    map.fitBounds(wilayahLayer.getBounds());

});



// ==========================
// TITIK SEKOLAH
// ==========================

var sekolahLayer;

fetch('../Data/TITIK SEKOLAH FIX.geojson')

.then(response => response.json())

.then(data => {

    sekolahLayer = L.geoJSON(data, {

        pointToLayer:function(feature,latlng){

            var jenjang =
            String(feature.properties.Jenjang || '')
            .toUpperCase();

            var warna = 'orange';

            if(jenjang.includes('SD')){
                warna = 'green';
            }

            else if(jenjang.includes('SMP')){
                warna = 'blue';
            }

            else if(jenjang.includes('SMA')){
                warna = 'red';
            }

            return L.circleMarker(latlng,{

                radius:8,
                fillColor:warna,
                color:'white',
                weight:2,
                fillOpacity:1

            });

        },



        onEachFeature:function(feature,layer){

    // POPUP MODERN
    layer.bindPopup(

        '<div style="width:220px;font-family:Arial;">' +

        '<div style="background:#2563EB;color:white;padding:12px;border-radius:12px 12px 0 0;text-align:center;font-size:18px;font-weight:bold;">' +

        '🏫 ' + feature.properties.Name +

        '</div>' +

        '<div style="background:white;padding:15px;border-radius:0 0 12px 12px;line-height:1.8;font-size:14px;">' +

        '<b>Jenjang :</b> ' +
        feature.properties.Jenjang +

        '<br>' +

        '<b>Jenis :</b> ' +
        feature.properties.Jenis +

        '<br>' +

'<b>NPSN :</b> ' +
feature.properties.NPSN +

        '</div>' +

        '</div>'

    );



    // HOVER EFFECT
    layer.on({

        mouseover:function(e){

            e.target.setStyle({

                radius:12,
                weight:3

            });

        },



        mouseout:function(e){

            e.target.setStyle({

                radius:8,
                weight:2

            });

        }

    });

}

    }).addTo(map);



    sekolahLayer.eachLayer(function(layer){

        layer.bringToFront();

    });

});



// ==========================
// LEGENDA
// ==========================

var legend = L.control({
    position:'bottomright'
});

legend.onAdd = function(map){

    var div =
    L.DomUtil.create('div','info legend');

    div.innerHTML = `

    <div style="
        background:white;
        padding:10px;
        border-radius:10px;
        box-shadow:0 0 10px rgba(0,0,0,0.2);
        font-family:Arial;
    ">

    <h3 style="
margin-bottom:10px;
font-size:18px;
">
LEGENDA
</h3>

    <p>
    <span style="color:green;">●</span>
    SD
    </p>

    <p>
    <span style="color:blue;">●</span>
    SMP
    </p>

    <p>
    <span style="color:red;">●</span>
    SMA
    </p>

    </div>

    `;

    return div;

};

legend.addTo(map);



// ==========================
// SEARCH
// ==========================

L.Control.geocoder({

    defaultMarkGeocode:true,

    placeholder:'Cari lokasi...'

}).addTo(map);

// ==========================
// TUNGGU SEMUA LAYER
// ==========================

setTimeout(() => {

    var overlayMaps = {

        "Wilayah Kecamatan": wilayahLayer,
        "Titik Sekolah": sekolahLayer

    };

    L.control.layers(null, overlayMaps).addTo(map);

}, 1000);

// ======================
// MINI MAP
// ======================

var miniMapLayer = L.tileLayer(

    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

);

new L.Control.MiniMap(

    miniMapLayer,

    {

        position:'bottomleft',

        toggleDisplay:true,

        minimized:false

    }

).addTo(map);

// ======================
// SCALE BAR
// ======================

L.control.scale({

    position:'bottomleft',

    metric:true,

    imperial:false

}).addTo(map);

// ======================
// KOORDINAT CURSOR
// ======================

var koordinat = L.control({

    position:'bottomleft'

});



koordinat.onAdd = function(){

    this._div = L.DomUtil.create(

    'div',

    'info koordinat'

);

    this.update();

    return this._div;

};



koordinat.update = function(lat,lng){

    this._div.innerHTML =

    '<b>Lat:</b> ' +

    (lat ? lat.toFixed(5) : '-') +

    ' | <b>Lng:</b> ' +

    (lng ? lng.toFixed(5) : '-');

};



koordinat.addTo(map);



map.on('mousemove',function(e){

    koordinat.update(

        e.latlng.lat,

        e.latlng.lng

    );

});

// ======================
// TOMBOL HOME
// ======================

var homeControl = L.control({

    position:'topleft'

});



homeControl.onAdd = function(){

    var div = L.DomUtil.create(

        'div',

        'home-button'

    );



    div.innerHTML = '🏠';



    div.onclick = function(){

        map.setView(

            [-5.43,105.27],

            13

        );

    };



    return div;

};



homeControl.addTo(map);