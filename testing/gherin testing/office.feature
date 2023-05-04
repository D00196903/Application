Feature: Display  Office Details

As a user
I want to view the office details
So that I can access the coordinator, address, location, email, and contact information

Background:
Given I am on the office page

Scenario: Loading the office details
Given the office details are not loaded
When I visit the office page
Then a loading indicator should be displayed with the message "Please Wait..."
And the office details should be fetched from the Firestore collection "offices"

Scenario: Displaying the fetched office details
Given the office details are successfully fetched
When the office details are ready to be displayed
Then the loading indicator should be dismissed
And the office details should be displayed including coordinator, address, location, email, and contact information

Scenario: Error while fetching office details
Given there is an error while fetching the office details
When the error occurs
Then the loading indicator should be dismissed
And a toast should be displayed with the message "Enter Email"