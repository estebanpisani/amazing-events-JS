# Amazing Events
Website developed for an event organizer company.

It consists of 6 pages that show different information.

The information of events and reference dates is consumed from an [API](https://amazingeventsapi.herokuapp.com/api/eventos).
## Index
Shows all events.
Each event has a link that redirects to a [details page](https://github.com/estebanpisani/amazing-events-JS/new/main?readme=1#details).
It has the possibility of filtering events by name and by existing categories. These filters can be combined with each other.
## Upcoming Events
Shows events that have not yet happened.

The current date provided by the API is used as a reference.

It has the possibility of filtering events by name and by existing categories. These filters can be combined with each other.
## Past Events
Shows events that have already happened.

The current date provided by the API is used as a reference.

Like **Index** and **Upcoming Events**, the results can be filtered by name and category.

## Details

Each event has a link called "**More Info**". When clicking on it from any of the sites where it is displayed, the page is redirected to another where it shows all the available information.
## Contact
Classic contact form.

In this sample it only shows an alert indicating that the message has been sent successfully.
## Stats
General statistics of the events.
