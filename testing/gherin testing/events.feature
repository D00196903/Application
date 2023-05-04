Feature: Create Event

  As a user
  I want to create an event with the necessary information
  So that I can share and manage events

  Background:
    Given I am logged in as a user
    And I am on the add event page

  Scenario: Create a new event with valid inputs
    When I enter a valid event title
    And I enter a valid event location
    And I enter valid event details
    And I click the "Submit" button
    Then a loading indicator should be displayed with the message "Please Wait..."
    And the new event should be added to the Firestore "events" collection
    And the loading indicator should be dismissed
    And I should be redirected to the "show" page

  Scenario: Attempt to create an event with a missing title
    Given I am on the add event page
    When I leave the event title field blank
    And I enter a valid event location
    And I enter valid event details
    And I click the "Submit" button
    Then I should see a toast with the message "Enter event title"
    And the event should not be created

  Scenario: Attempt to create an event with a missing location
    Given I am on the add event page
    When I enter a valid event title
    And I leave the event location field blank
    And I enter valid event details
    And I click the "Submit" button
    Then I should see a toast with the message "Enter event location"
    And the event should not be created

  Scenario: Attempt to create an event with missing details
    Given I am on the add event page
    When I enter a valid event title
    And I enter a valid event location
    And I leave the event details field blank
    And I click the "Submit" button
    Then I should see a toast with the message "Enter event details"
    And the event should not be created

Feature: Edit Event
  As a user
  I want to edit an existing event with updated information
  So that I can keep my events up to date and accurate

  Background:
    Given I am logged in as a user
    And I am on the edit event page
    And I have the event ID

  Scenario: Edit an event with valid inputs
    Given I am viewing the event details
    When I update the event title with a valid title
    And I update the event location with a valid location
    And I update the event details with valid details
    And I click the "Update" button
    Then a loading indicator should be displayed with the message "Please Wait..."
    And the event should be updated in the Firestore "events" collection with the new information
    And the loading indicator should be dismissed
    And I should be redirected to the "show" page

  Scenario: Attempt to edit an event with a missing title
    Given I am viewing the event details
    When I leave the event title field blank
    And I update the event location with a valid location
    And I update the event details with valid details
    And I click the "Update" button
    Then I should see a toast with the message "Enter event title"
    And the event should not be updated

  Scenario: Attempt to edit an event with a missing location
    Given I am viewing the event details
    When I update the event title with a valid title
    And I leave the event location field blank
    And I update the event details with valid details
    And I click the "Update" button
    Then I should see a toast with the message "Enter event location"
    And the event should not be updated

  Scenario: Attempt to edit an event with missing details
    Given I am viewing the event details
    When I update the event title with a valid title
    And I update the event location with a valid location
    And I leave the event details field blank
    And I click the "Update" button
    Then I should see a toast with the message "Enter event details"
    And the event should not be updated


	Feature: View event
	As a user
	I want to view and manage events
	So that I can keep track of upcoming activities and delete them when necessary

	Background:
	Given I am on the show events page

	Scenario: Fetching and displaying events
	Given the events are stored in the database
	When I view the events
	Then a loading indicator should be displayed with the message "Please Wait..."
	And the events should be fetched from the "events" collection
	And the events should be displayed with their title, details, and location
	And the loading indicator should be dismissed

	Scenario: Error while fetching events
	Given there is an error while fetching events
	When the error occurs
	Then the loading indicator should be dismissed
	And a toast should be displayed with the message "Enter Email"

	Scenario: Deleting an event
	Given I want to delete an event
	When I choose to delete the event
	Then a loading indicator should be displayed with the message "Please Wait..."
	And the event should be deleted from the "events" collection
	And the loading indicator should be dismissed

	Scenario: Displaying a toast message
	Given I want to display a toast message
	When the showToast function is called with a message
	Then a toast should be displayed with the specified message
	And the toast should have a duration of 3000 milliseconds