# CrimeFinderUK

This project was created to allow me to continue to practice using the Angular framework, whilst providing more exerience with consuming APIs of different types.

The technologies used include the Angular framework, Angular Material, and TypeScript.

The app is designed to get the users current location via the browser Geolocation API, then to initially display the users location on a map. The map is rendered via the Open Street Map API. The UK Police API is then used to check for crimes in that area, with the results being output in a table which the user can explore. The user is then able to search for crimes in different locations and years. This is achieved though a form, and API calls to the OSM geolocation API.

This software is open source and free to use for any purpose.

## App Architecture

The app is built around 3 main tabs:

- Info - Displays crime data retreived from the UK Police API to the user in an easy to read table format
- Map - Displays the users search location
- Search - Form to allow user to enter search location and year

The app uses one main shared service, data.service. This service is used across the components as the entry point for all API calls. Components are then able to subscribe to data service methods, using RxJS observables to recieve data.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
