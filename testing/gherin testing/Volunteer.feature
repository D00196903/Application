Feature: Volunteer Registration

  Scenario: Volunteer registers successfully
    Given the Volunteer is on the Volunteer Registration page
    When the Volunteer enters their fullname, location, mobile, and position
    And clicks on the Register button
    Then the Volunteer should be redirected to the Home page
    And a new Volunteer record should be added to the database

  Scenario: Volunteer registration fails due to missing fields
    Given the Volunteer is on the Volunteer Registration page
    When the Volunteer leaves one or more required fields empty
    And clicks on the Register button
    Then an error message should be displayed
    And the Volunteer record should not be added to the database

  Scenario: Volunteer registration fails due to database error
    Given the Volunteer is on the Volunteer Registration page
    And the database is not accessible
    When the Volunteer fills in all required fields
    And clicks on the Register button
    Then an error message should be displayed
    And the Volunteer record should not be added to the database


	Feature: Show Volunteers
	Scenario: User wants to view volunteers
	Given User is on the Show Volunteers page
	When User opens the page
	Then User should see a list of all volunteers

	Scenario: User wants to delete a volunteer
	Given User is on the Show Volunteers page
	When User clicks on the delete button next to a volunteer's name
	Then User should see a confirmation message
	And Volunteer should be removed from the list of volunteers

	Scenario: User wants to edit a volunteer
	Given User is on the Show Volunteers page
	When User clicks on the edit button next to a volunteer's name
	Then User should be redirected to the Edit Volunteer page
	And The volunteer's details should be pre-populated in the form

	Scenario: User wants to add a new volunteer
	Given User is on the Show Volunteers page
	When User clicks on the Add Volunteer button
	Then User should be redirected to the Add Volunteer page
	And The form should be empty