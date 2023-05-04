Feature: Chat Application


  Background:
    And I am on the chat page

  Scenario: Display existing chat messages
    Given there are existing chat messages in the database
    When I visit the chat page
    Then I should see the existing chat messages displayed in chronological order

  Scenario: Send a chat message
    Given I am on the chat page
    When I enter a username
    And I enter a message
    And I click the "Submit" button
    Then the message should be sent to the database with a timestamp and a unique ID
    And the message should appear in the chat window
    And the username field should retain the entered username

  Scenario: Receive new chat messages in real-time
    Given I am on the chat page
    And Staff sends a chat message
    When the new message is added to the database
    Then the message should be displayed in the chat window in real-time
