# The initial task
This project and explanation is intended as homework to prove technical abilities regarding Angular.

The project is intended for **DKV Mobility**. Below is a rough explanation of how the backend and frontend logic works.

Tech stack: **Angular 20 - Express - Mongo**

# Running the project
- Clone the project
- Navigate to the frontend `cd frontend` and install dependencies `npm install`
- Navigate to the backend `cd backend` and install dependencies `npm install`
- `docker compose up` from the root of the project to start mongo and the backend
- Navigate to the frontend `cd frontend` and start the application `npm run start`

# Frontend
The frontend project solves the problem in the business case presented. It uses Angular 20 patterns to make calls to the
backend, store data, modify data and provide the desired functionality.

## Objectives
A non-exhaustive list of the criteria that were met:
- Display a list of available vehicles
- Provide detailed views for individual vehicles
- Allow creation, editing, and deletion of vehicles
- Implement a search functionality
- Provide a state management solution for the data
- Use the provided openapi.yml as the data model
- Integrate with a REST API

### Home Page – Vehicle List

- Displays a list of available vehicles retrieved from the API
- Displays a clear message when no vehicles are available
- Allows navigation to the vehicle details page
- Provides edit and delete actions with confirmation modals
- Integrates application-wide state management
- By default, data is sorted in alphabetical order
- Shows essential vehicle information:
  - Vehicle name
  - Manufacturer
  - Model
  - Vehicle type (e.g. SUV)
  - Fuel type (e.g. Diesel)
  - Mileage (if available)

- Supports:
  - Sorting
  - Filtering
  - Searching



### Vehicle Details Page
- Dedicated page for an individual vehicle
- Displays all available vehicle information
- Data is retrieved from the API using the vehicle identifier

### Add New Vehicle Modal
- Accessible via an “Add new vehicle” button
- Allows users to enter vehicle details as defined in openapi.yml
- Validates all input fields before submission
- Submits data to the API for persistence
- Updates the vehicle list dynamically after a successful submission without a refetch
- Modal closes only after a successful API response

### Search
- Uses a query string to match vehicle data from the backend using regular expression
- The regular expressions are case-insensitive
- Can match partial results for easier searching
- Matched text is highlighted in the UI

### State Management
- State management functionality without external libraries
- Implemented using signals to store data and observables to fetch data
- Uses a service to manage vehicles data in a reactive manner
- The source of truth is outside the component (in the service), public accessors are present for the data but the internals of the service handle everything
- State updated automatically on a refetch when filters change
- Search state is handled in another service

# Backend
The backend is a quick and dirty Node.js, Express and Mongoose stack. It responds to calls according to the api
reference in the assignment. 

As it was not the focus of the assignment, it has certain shortcomings, such as proper
validation, but it fulfills its purpose.

## GET /vehicles
Defaults to sorting by newest (_id descending) if no sorting is present.

Returns a list of vehicles with optional:
- Filters: fuelType, vehicleType, minimumMileage, maximumMileage
- Sorting: via sorters (ascending/descending per field)

## POST /vehicles
Creates a new vehicle using the request body data and returns the newly saved vehicle.

## POST /vehicles/search
Performs a text-based search using queryString, with case-insensitive partial matching.

Matches against:
- manufacturer
- name
- vehicle model
- fuel
- vehicle type


## GET /vehicles/:id
Fetches a single vehicle by its ID.
Returns 404 if not found.

## PUT /vehicles/:_id
Updates an existing vehicle by ID. Returns the updated vehicle.

## DELETE /vehicles/:_id
Deletes a vehicle by ID.
Returns the deletion result.