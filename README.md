# Food Donation P2P

It is a peer to peer food donation platform.

## Working

Users can post:

1. Donation - If user has excess food.

2. Request - If user requires food.

All users can see publicly available donations and requests.

Volunteers can apply to fulfill a donation or request.

The volunteer's application is approved by the owner of the post.

Once approved, the order post is no longer publicly visible.

Users can see each other's contact information, location.

## Key Features

1. Google Login and Authentication - OAuth 2.0 and JWT

2. User's location with exact coordinates are used to calculate distances.

3. Peer to Peer communication of users with maximum transparency and minimal third-party intervention.

4. Daily Database Cleanup to handle expired food donations.

## Future Improvements

Scaling up and implementing System Design concepts.

Implementing RBAC with features exclusive to admin.

Including third party NGO's to manage storing, pickup, delivery, and organizing camps for food donations.

## Commands
From root:

Build Command - cd backend && npm i && cd .. && cd frontend && npm i

Start Command - cd backend && npm start && cd .. && cd frontend && npm run dev
