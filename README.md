# Commitment Issues

Commitment Issues is a companion app to GitHub that instills healthy version control habits by tracking whether developers have pushed to their remote repository within user-specified intervals. Let's say you want to shoot for 4 commits an hour. Every quarter of an hour, the app checks whether a push has been made by that user to that repository.

## Technologies Proposal

Front-end state will be managed by React and Redux. The user's commits will be populated by making calls to the GitHub API. Time of the user's most recent commit will be checked against their goal interval to render a commit-and-push reminder. Meshing with a database on the backend will probably be the largest challenge. While user authentication will be handled with OAuth, the user, and at minimum, the user's repositories will need to be stored so that the API call can handle populating the details of each repository.

## Wireframes

[Main Screen Wireframes](/meta-assets/wireframes/main_screen.png)

## Stretch Goals

React Native implementation

Tracking commits to repositories that are not the user's own

In addition to listing the user's commits, listing all contributors' pushes to the given repository, and update every time the API call is made.
