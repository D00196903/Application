Feature: User Login

As a user
I want to log in to the application
So that I can access the features and functionalities

Background:
Given I am on the login page

Scenario: Successful login
Given I have entered a valid email and password
When I click the "Login" button
Then a loading indicator should be displayed with the message "Please Wait..."
And the email and password should be authenticated against the stored credentials
And the loading indicator should be dismissed
And I should be redirected to the "buttons" page

Scenario: Failed login due to incorrect email or password
Given I have entered an incorrect email or password
When I click the "Login" button
Then a loading indicator should be displayed with the message "Please Wait..."
And the email and password should fail to authenticate against the stored credentials
And the loading indicator should be dismissed
And a toast with the message "Enter Email" should be displayed

Scenario: Failed login due to incomplete form
Given I have not entered an email or password
When I click the "Login" button
Then a toast with the message "Enter email" or "Enter password" should be displayed
And I should not be redirected to the "buttons" page