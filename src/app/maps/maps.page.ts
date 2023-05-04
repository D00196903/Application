import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Location} from '../interfaces/location';
import { MarkerEl } from '../interfaces/marker';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnDestroy {
  apiKey = environment.keys.googleMaps;
  @ViewChild('map') // Getting a reference to the map element in the component's HTML template.
  public mapEl!: ElementRef<HTMLElement>;
  public map!: GoogleMap; //  Creating a public variable map that will hold the Google Map instance.
  public locations: Array<Location> = [ // Initializing an empty array of Location objects.
    {
      country: 'Cavan',
      lat: 53.989637,
      lng: -7.362098,
      description: `Plunkett House, 26 Bridge St,
       H12 C9P7,
     (049) 432 6339,
      10am - 6pm`,
      locations: []
    },
    {
      country: 'Drogheda',
      lat: 53.717373,
      lng: -6.351263,
      description: `30 Magdalene St,
      A92 WK46,
     (041) 984 8754,
      10am - 9pm`,
      locations: []
    },
    {
      country: 'Laois',
      lat: 53.031351,
      lng: -7.302266,
      description: `Shamrock House, Abbeyleix Rd,
       R32 AH51,
      083-0291706,
    10am - 6pm `,
      locations: []
    },
    {
      country: 'Dundalk',
      lat: 54.00488,
      lng: -6.394564,
      description: ` 42 Jocelyn Street,
      A91 TE26,
     042-9327311,
    10am - 6pm `,
      locations: []
    },

    {
      country: 'Navan',
      lat: 53.65232,
      lng: -6.686131,
      description: `15 Trimgate Street, 
       C15 PT99
     046-9077682
      10am - 6pm `,
      locations: []
    },

    {
      country: 'Monaghan',
      lat: 54.249078,
      lng: -6.967021,
      description: `3 Diamond Units, The Diamond, 
       H18 X971,
      047-72375,
      10am - 6pm, `,
      locations: []
    }

  ]
  public heading: string = ""; // Initializing an empty string for the heading.
  public description: string = ""; //  Initializing an empty string for the description.
  public locationOptions = { //  Initializing an object with location options.
    header: 'Sosad Ireland offices',
    subHeader: '',
    message: '',
    translucent: true,
  };
  private markers: Array<MarkerEl> = []; //Initializing an empty array of MarkerEl objects.
  ids: string[] = []; // Initializing an empty array of marker IDs.
  constructor() { // Defining the component's constructor, which sets the initial values for heading and description.
    this.heading = 'Select an office';
    this.description = '';
  }
  //method, which waits 500 milliseconds and then calls the createMap method to create a new Google Map instance.
  ionViewDidEnter() {
    setTimeout(async () => {
      await this.createMap();
      await this.addMarkers(); // Add this line to call addMarkers method after creating the map
    }, 500);
  }
  //Defining the ngOnDestroy method, which removes all map listeners and destroys the map instance when the component is destroyed.
  ngOnDestroy() {
    this.map.removeAllMapListeners();
    this.map.destroy();
  }
  //Defining the selected method, which is called when a user selects a specific location from the dropdown menu.
  public selected(event: any): void {
    const locations = this.locations.filter((item: any) => item.country === event.detail.value);
    this.location(locations[0]);
    if (this.markers.length > 0) {
      this.removeMarkers();
    }

    // Render to component view
    this.heading = locations[0].country;
    this.description = locations[0].description;
  }
  //Defining the createMap method, which creates a new Google Map instance and sets its configuration
  private async createMap(): Promise<void> {
    this.map = await GoogleMap.create({
      id: 'google-map',
      element: this.mapEl.nativeElement,
      apiKey: environment.keys.googleMaps,
      forceCreate: true,
      config: {
        center: {
          lat: 1.0667172756631198,
          lng: 103.96214500683499
        },
        zoom: 5
      }
    });
  }
  //Defining the location method, which zooms to the selected location on the map and adds markers for that location.
  private async location(selectedLocation: Location): Promise<void> {
    await this.manageMap(selectedLocation);
    await this.manageMarkers(selectedLocation);
  }
  //The manageMap method is async and takes a Location parameter. It waits for
  //the setCamera method to finish executing using the await keyword. The setCamera
  // method sets the camera of a map to a specific location and zoom level, specified
  //in an object argument that includes a coordinate object with lat and lng properties
  //set to the location parameter's lat and lng properties respectively.
  private async manageMap(location: Location): Promise<void> {
    await this.map.setCamera({
      coordinate: {
        lat: location.lat,
        lng: location.lng,
      },
      zoom: 7
    });
  }
  //defines a private asynchronous method called manageMarkers that
  //takes a Location parameter and returns a Promise of type void.
  private async manageMarkers(selectedLocation: Location): Promise<void> {
    this.markers = this.generateMarkers([selectedLocation]);
    this.ids = await this.map.addMarkers(this.markers);
    this.markers.map((marker, index) => {
      marker.markerId = this.ids[index];
    });
    await this.map.setOnMarkerClickListener((event) => {
      this.manageMarker(event);
    });
  }
  //line 167: defines a private method called manageMarker that takes an event parameter of any type and returns void.
  // Line 169 - 173: This  creates a new array called summary by filtering the this.markers array based on whether each item's markerId property matches the markerId property of the event parameter.
  private manageMarker(event: any): void {
    const summary = this.markers.filter((item: any) => {
      if (item.markerId === event.markerId) {
        return item;
      }
    });

    // this  sets the heading and description properties of the class to the title and snippet properties, respectively, of the first item in the summary array.
    this.heading = summary[0].title;
    this.description = summary[0].snippet;
  }
  // Line 179: This line defines a private method called generateMarkers that takes an array of locations of type Locations and returns an array of any type.
  //Line 182 - 189: returns a new array of objects created by mapping through the locations array and transforming each item into an object with coordinate, title, and snippet properties
  private generateMarkers(locations: Array<Location>): Array<any> {
    return locations.map((location: any, index: number) => ({
      coordinate: {
        lat: location.lat,
        lng: location.lng
      },
      title: location.name,
      snippet: location.description
    }));
  }
  private async removeMarkers(): Promise<void> { // defines a private asynchronous method called removeMarkers that returns a Promise of void.
    //  this first creates an array of marker IDs from the markers array of the class. Then, the removeMarkers method of the map object is called with the markers array as an argument to remove the markers from the map. Finally, the ids and markers properties of the class are reset to empty arrays.
    const markers = this.markers.map((marker) => marker.markerId);
    this.map.removeMarkers(markers);
    this.ids = [];
    this.markers = [];
  }
  // Add markers to the map for each location
  private async addMarkers(): Promise<void> {
    for (const location of this.locations) {
      const marker: MarkerEl = {
        coordinate: {
          lat: location.lat,
          lng: location.lng,
        },
        title: location.country,
        snippet: location.description,
        markerId: ''
      };
      const markerId = await this.map.addMarker(marker);
      marker.markerId = markerId;
      this.markers.push(marker);
    }

    await this.map.setOnMarkerClickListener((event) => {
      this.manageMarker(event);
    });
  }
  

}
