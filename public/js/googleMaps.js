"use strict";

      const CONFIGURATION = {
        "ctaTitle": "Event Location:",
        "mapOptions": {"center":{"lat":1.3521,"lng":103.8198},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":false,"zoom":13,"zoomControl":true,"maxZoom":22,"mapId":""},
        "mapsApiKey": "AIzaSyAkIJSwIxhL_0K6hzTOZeDFZmeAyiu9NDI",
        "capabilities": {"addressAutocompleteControl":true,"mapDisplayControl":true,"ctaControl":true}
      };

      const SHORT_NAME_ADDRESS_COMPONENT_TYPES =
          new Set(['street_number', 'postal_code']);

      const ADDRESS_COMPONENT_TYPES_IN_FORM = [
        'location',
        'locality',
        'postal_code',
        'country',
      ];

      function getFormInputElement(componentType) {
        return document.getElementById(`${componentType}-input`);
      }

      function fillInAddress(place) {
        function getComponentName(componentType) {
          for (const component of place.address_components || []) {
            if (component.types[0] === componentType) {
              return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType) ?
                  component.short_name :
                  component.long_name;
            }
          }
          return '';
        }

        function getComponentText(componentType) {
          return (componentType === 'location') ?
              `${getComponentName('street_number')} ${getComponentName('route')}` :
              getComponentName(componentType);
        }

        for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
          getFormInputElement(componentType).value = getComponentText(componentType);
        }
      }

      function renderAddress(place, map, marker) {
        if (place.geometry && place.geometry.location) {
          map.setCenter(place.geometry.location);
          marker.position = place.geometry.location;
          map.setZoom(15); // Set the zoom level as desired
        } else {
          marker.position = null;
        }
      }

      async function initMap() {
        const {Map} = google.maps;
        const {AdvancedMarkerElement} = google.maps.marker;
        const {Autocomplete} = google.maps.places;

        const mapOptions = CONFIGURATION.mapOptions;
        mapOptions.mapId = mapOptions.mapId || 'DEMO_MAP_ID';
        mapOptions.center = mapOptions.center || {lat: 1.3521, lng: 103.8198};

        const map = new Map(document.getElementById('gmp-map'), mapOptions);
        const marker = new AdvancedMarkerElement({map});
        const autocomplete = new Autocomplete(getFormInputElement('location'), {
          fields: ['address_components', 'geometry', 'name'],
          types: ['geocode'], // Use 'geocode' type for Singapore
          componentRestrictions: {country: 'sg'} // Restrict to Singapore
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log(place + "lmao")
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert(`No details available for input: '${place.name}'`);
            return;
          }
          renderAddress(place, map, marker);
          fillInAddress(place);
          retrieveAddress();
        });
      }

      function retrieveAddress() {
        const address = {
          location: document.getElementById('location-input').value,
          locality: document.getElementById('locality-input').value,
          postalCode: document.getElementById('postal_code-input').value,
          country: document.getElementById('country-input').value
        };
         const formattedAddress = `${address.location}, ${address.locality} ${address.postalCode}, ${address.country}`;
         console.log(address);
         document.getElementById('eventLocation').value = formattedAddress;
      }