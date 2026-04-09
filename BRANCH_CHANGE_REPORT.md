# NestQueue V2 Change Report

Prepared on April 9, 2026 for branch `nestqueue.V2`.

## Snapshot

- Branch compared against `main`
- Committed changes on the branch: 1 commit
- Additional local changes currently present in the branch working tree: yes
- Net working-tree delta vs `main`: 23 files changed, 2,220 insertions, 510 deletions

Important note: only one change is currently committed to `nestqueue.V2`. Most of the product changes described below are still local edits in the branch working tree and are not yet captured in a commit.

## What Is New For App Users

### 1. New dashboard-first experience after login

Users are now sent to a dedicated dashboard after signing in instead of landing directly in the ticket list. The dashboard introduces:

- top-level visibility into active, new, in-progress, resolved, escalated, high-priority, and reviewed tickets
- recent activity tracking pulled from ticket activity logs
- quick links into filtered ticket queues by category and priority

## 2. Full app shell for protected pages

Protected pages now run inside a structured application shell rather than a bare page layout. This adds:

- persistent left navigation for Dashboard, Ticket Queue, New Ticket, and Settings
- header search for tickets
- mobile sidebar behavior
- theme toggle with cleaner light/dark mode handling

## 3. Redesigned ticket queue

The ticket queue has been reworked into a more operational view for staff. Users will notice:

- separate tabs for Active Queue and Resolved / Closed tickets
- filtering by workflow status, priority, category, location, technician, and instructor review status
- queue columns focused on ticket number, date, user, device, priority, category, technician, status, escalation, and review
- direct path from the queue to a standalone new-ticket flow

## 4. Standalone “Create New Ticket” page

Ticket creation is no longer centered on the old modal-only flow. The new flow adds:

- a dedicated `/tickets/new` page
- fields for user name, device ID, location, priority, category, assigned technician, and reported problem
- automatic creation of a more structured ticket record at submit time
- automatic creation of an initial activity log entry when the ticket is opened

## 5. Major upgrade to ticket editing

Ticket editing has been expanded from a simple form into a multi-section workspace. Users can now work with:

- workflow-specific statuses such as New, In Progress, Waiting on User, Resolved, Escalated, and Closed
- documentation sections for reported problem, observations, questions asked, root cause, solution applied, verification, and final notes
- troubleshooting step tracking
- escalation flag and escalation reason
- activity history
- instructor review fields, including review status, completion status, and private notes
- ticket deletion from the edit page

## 6. Better ticket data captured behind the scenes

Tickets now support richer structured data, including:

- workflow status separate from the legacy status field
- device ID and physical location
- documentation object
- troubleshooting steps array
- escalation object
- activity log entries
- instructor review object

This should make future reporting, filtering, and audit history much stronger than the current flat ticket shape.

## 7. Login and visual refresh

The branch includes a broader UI refresh across login and protected pages:

- home route now redirects to `/login`
- login page styling has been modernized
- background and shell styling have been refreshed
- dark mode behavior is more deliberate and no longer depends only on system CSS media rules

## 8. Environment setup improvement

The only currently committed change on the branch adds `client/example.env`, giving developers an example environment file for MongoDB and Firebase configuration.

## Suggested User-Facing Summary

NestQueue V2 introduces a more structured support workflow. Staff now start from a dashboard, work inside a dedicated app shell, create tickets from a full-page form, and manage tickets with richer documentation, troubleshooting, escalation, and instructor review tools. The ticket queue also adds stronger filtering and separation between active and resolved work.

## Release Notes Draft

NestQueue V2 includes a redesigned ticket workflow focused on faster triage and better documentation. Users will see a new dashboard, an updated ticket queue with stronger filtering, a full-page ticket creation flow, and a much more detailed ticket editor with troubleshooting history, escalation tracking, activity logs, and instructor review fields. The release also refreshes the login and app layout experience and lays the groundwork for more reliable reporting through richer ticket metadata.

## Internal Notes Before Sharing

- Only `client/example.env` is committed on `nestqueue.V2` today.
- The larger UI and ticketing changes are currently local branch changes and should be reviewed, tested, and committed before being announced as released.
- There are untracked route folders in the working tree, which means the branch is still in progress.
