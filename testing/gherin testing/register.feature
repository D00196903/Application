Feature: User Registration

As a new user
I want to register for an account
So that I can access the application with my credentials

Background:
Given I am on the registration page

Scenario: Filling out the registration form with valid details
Given I enter a valid email
And I enter a valid password
When I submit the registration form
Then a loading indicator should be displayed with the message "Registering..."
And a new user account should be created with the provided email and password

Scenario: Successfully registering a new user
Given the new user account is created successfully
When the registration is complete
Then the loading indicator should be dismissed
And the user should be redirected to the home page

Scenario: Form validation with missing email or password
Given I have not entered an email or password
When I try to submit the registration form
Then I should see a toast message indicating the missing information
And the form should not be submitted

Scenario: Error during user registration
Given there is an error while registering the user
When the error occurs
Then the loading indicator should be dismissed
And a toast should be displayed with the message "Enter Input"