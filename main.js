//Cesium token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTViY2E5OS1jOWUyLTRiMjgtOTY0My0xMjJhYmNkMmZhM2MiLCJpZCI6MjQxNzg1LCJpYXQiOjE3Mjc2OTQ4Njd9.Ku5x0fQnn9ZSOWkjT5HcaMP9SyPeKbIYhGRGvUWm1Ng';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
  scene3DOnly: true,
  baseLayerPicker: true,
  infoBox: false,  
  HomeButton: false, 
  timeline: true,
  animation: true,

});

// Enable lighting for better extrusion visibility
viewer.scene.globe.enableLighting = true;
//Loading Garden Data
Cesium.GeoJsonDataSource.load('Garden.geojson',{
    stroke: Cesium.Color.LIGHTGREEN,
    fill: Cesium.Color.LIGHTGREEN.withAlpha(1),
    strokeWidth: 2,
}).then(function (gardenDataSource) {
    viewer.dataSources.add(gardenDataSource);
})
.catch(function (error) {
  console.log("Error loading Garden:", error);
});

//Loading Lawn Data
Cesium.GeoJsonDataSource.load('Lawn.geojson',{
  stroke: Cesium.Color.DARKGREEN,
  fill: Cesium.Color.DARKGREEN.withAlpha(1),
  strokeWidth: 2,
}).then(function (LawnDataSource) {
  viewer.dataSources.add(LawnDataSource);
})
.catch(function (error) {
  console.log("Error loading Lawn:", error);
});
//Loading footpath
Cesium.GeoJsonDataSource.load('Footpath.geojson',{
  stroke: Cesium.Color.DARKGREY,
  fill: Cesium.Color.DARKGREY.withAlpha(0.5),
  strokeWidth: 2.5,

}).then(function (FootpathDataSource) {
  viewer.dataSources.add(FootpathDataSource);
})
.catch(function (error) {
  console.log("Error loading Footpath:", error);
});
//Loading Road
Cesium.GeoJsonDataSource.load('Road.geojson',{
  stroke: Cesium.Color.BLACK,
  fill: Cesium.Color.BLACK.withAlpha(1),
  strokeWidth: 8,
}).then(function (RoadDataSource) {
  viewer.dataSources.add(RoadDataSource);
})
.catch(function (error) {
  console.log("Error loading Road:", error);
});
//loading restaurants
Cesium.GeoJsonDataSource.load('Restaurant.geojson',{
  markerSize: 30,
  markerColor: Cesium.Color.PURPLE,
  markerSymbol:'restaurant'})
.then(function (RestaurantDataSource) {
  viewer.dataSources.add(RestaurantDataSource);
})
.catch(function (error) {
  console.log("Error loading restaurants:", error);
});
//loading pond
Cesium.GeoJsonDataSource.load('Pond.geojson',{
  markerSize: 30,
  markerColor: Cesium.Color.BLUE,
  markerSymbol:'water'})
.then(function (PondDataSource) {
  viewer.dataSources.add(PondDataSource);
})
.catch(function (error) {
  console.log("Error loading the pond:", error);
});
let buildingEntities = [];
//loading buildings then flying to the buildings
Cesium.GeoJsonDataSource.load('building.geojson', { clampToGround: false })
  .then(function (buildingDataSource) {
    viewer.dataSources.add(buildingDataSource);
  
    // Populate the buildingEntities array with loaded entities
    buildingEntities = buildingDataSource.entities.values.map(entity => {
      return {
        name: entity.properties.name.getValue(),  // Adjust this to match your property name
        entity: entity
      };
    });
    // Ensure that the data source is correctly loaded and has entities
    if (buildingDataSource && buildingDataSource.entities && buildingDataSource.entities.values.length > 0) {
      
      // Fly to the buildings once they are added
      viewer.flyTo(buildingDataSource, {
        duration: 3 // seconds
      });
      

      // Iterate over each building entity and apply extrusions
      buildingDataSource.entities.values.forEach(entity => {
        if (entity.polygon) {
          const height = entity.properties.height?.getValue() || 0;//getting the height
          const buildingId = entity.properties.building_id?.getValue() || null;

           const engheight = (buildingId === 9) ? 30 : 2.5;// Increase height for engennering building to add realism, same for the rest

          // Apply extrusion and styling
          Object.assign(entity.polygon, {
            extrudedHeight: height +  engheight,
            height: 0,
            material: Cesium.Color.SADDLEBROWN,
            outline: true,
            outlineColor: Cesium.Color.BLACK
          });
        }
      });
    } else {
      console.log("No entities found in the buildings data source.");
    }
  });
  