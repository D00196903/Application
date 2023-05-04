Feature: Create a request a call back
Scenario: User creates a new request with valid inputs
Given the user is on the Request Page
When the user fills in their full name, office, message, outcome, and mobile number
And the user clicks on the "Submit" button
Then a loader should appear on the screen
And the request should be added to the "requests" collection in Firestore
And the loader should disappear from the screen
And the user should be redirected to the Home page

Scenario: User creates a new request with invalid inputs
Given the user is on the Request Page
When the user leaves any of the required fields empty
And the user clicks on the "Submit" button
Then a toast message should appear on the screen with a corresponding error message
And the request should not be added to the "requests" collection in Firestore
And the user should remain on the Request page

Feature: Edit Request
As a user
I want to edit requests with the necessary information
So that I can update and manage requests
Background:
Given I am logged in as a user
And I am on the edit request page

Scenario: Update a request with a valid outcome
Given I am editing an existing request
When I enter a valid outcome for the request
And I click the "Submit" button
Then a loading indicator should be displayed with the message "Please Wait..."
And the request should be updated in the Firestore "requests" collection
And the loading indicator should be dismissed
And I should be redirected to the "show-request" page

Scenario: Attempt to update a request with a missing outcome
Given I am editing an existing request a call back
When I leave the outcome field blank
And I click the "Submit" button
Then I should see a toast with the message "please enter the outcome of this situation"
And the request should not be updated

Feature: Show Request a call back
Scenario: User can view request a call back
Given the user is on the "Show Requests" page
When the page loads
Then the system should display a loader with the message "Please Wait..."
And the system should fetch all requests from the database
And the system should display the requests in a table with columns "Fullname", "Office", "Mobile", "Message" 
And the system should dismiss the loader

Scenario: User can delete a request a call back
Given the user is on the "Show Requests" page
When the user clicks on the "Delete" button for a specific request
Then the system should display a loader with the message "Please Wait..."
And the system should delete the request from the database
And the system should remove the request from the table
And the system should dismiss the loader

Scenario: Error handling
Given the user is on the "Show Requests" page
When an error occurs while fetching requests from the database
Then the system should display a toast message with the text "Enter Email"
And the system should dismiss the loader