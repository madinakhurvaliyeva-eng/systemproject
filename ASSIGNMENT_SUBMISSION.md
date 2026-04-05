# Team-based GitHub Project Collaboration Submission

## Demo Accounts

Use these accounts for the app demo:

| Role | Email | Password |
| --- | --- | --- |
| Project Owner | `owner@madinaga.demo` | `owner123` |
| Collaborator One | `collab1@madinaga.demo` | `collab123` |
| Collaborator Two | `collab2@madinaga.demo` | `review123` |

## Repository Details

- Repo URL: `https://github.com/madinakhurvaliyeva-eng/systemproject`
- Visibility: `Public`
- Project Owner: owner@madinaga.demo / owner123
- Collaborator One: collab1@madinaga.demo / collab123
- Collaborator Two: collab2@madinaga.demo / review123

## Project Board

Create one GitHub Project board with these columns:

1. `Todo`
2. `In Progress`
3. `Review`
4. `Done`

## Issues

Create these 5 issues in the GitHub repository:

1. `#1 Design Login Page`
   UI module for the login and register interface in the browser.
2. `#2 Backend Validation for Login`
   Request validation for login and registration routes.
3. `#3 Build JSON Database Layer`
   Replace database dependency with local JSON-based persistence.
4. `#4 Register User Module`
   User registration endpoint, password hashing, and duplicate-email checks.
5. `#5 Forgot Password Integration`
   Reset token generation, password reset form, and password update logic.

## Milestones

Create these milestones and attach the issues:

1. `Milestone 1: Core Authentication`
   Includes `#1`, `#2`, and `#4`
2. `Milestone 2: Data + Recovery`
   Includes `#3` and `#5`

## Branch and PR Plan

Use this branch and pull request structure:

1. Collaborator One
   Branches: `feature/login-ui`, `feature/register-module`
   Pull Requests: `PR for #1`, `PR for #4`
2. Collaborator Two
   Branches: `feature/login-validation`, `feature/forgot-password`
   Pull Requests: `PR for #2`, `PR for #5`
3. Project Owner
   Branch: `feature/json-storage`
   Pull Request: `PR for #3`

Each PR should:

- Link to its GitHub Issue
- Be assigned to the matching Milestone
- Request review from the Project Owner before merge

## Screenshot Checklist

Add these screenshots to the submission:

1. Screenshot of the GitHub Project Board
2. Screenshot showing the Issues list
3. Screenshot showing the Milestones
4. Screenshot showing the Pull Requests

## Short Write-up

Our team worked in a three-member GitHub workflow where the Project Owner created the repository, configured the public project board, opened the issues and milestones, and reviewed incoming pull requests. Collaborator One handled the login page UI and the register module, Collaborator Two handled validation and forgot-password integration, and the Project Owner completed the JSON data layer and coordinated reviews and merges. We collaborated by splitting the work into small issues, using separate branches for each task, opening pull requests linked to issues and milestones, and using review feedback before merging changes into the main branch.
