Feature: Display  Offices on Google Maps

As a user
I want to view the offices on Google Maps
So that I can see their locations and access their information

Background:
Given I am on the maps page

Scenario: User views the map with no office selected
Given I have not selected an office from the dropdown menu
When the map is displayed
Then the map should be centered at coordinates (1.0667172756631198, 103.96214500683499) with a zoom level of 5
And the map should display no markers

Scenario: User selects an office from the dropdown menu
Given I have selected an office from the dropdown menu
When the map is displayed
Then the map should be centered on the selected office with a zoom level of 7
And a marker should be displayed for the selected office
And the heading should display the selected office's country
And the description should display the selected office's information

Scenario: User selects a different office from the dropdown menu
Given I have selected a different office from the dropdown menu
When the map is displayed
Then the map should be centered on the newly selected office with a zoom level of 7
And the previously displayed marker should be removed
And a new marker should be displayed for the newly selected office
And the heading should display the newly selected office's country
And the description should display the newly selected office's information