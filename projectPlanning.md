Project Plan

Community & Domain Setup

The database will store multiple communities.

Each community will be mapped to a unique domain.

When a user makes a request, the system will identify the community by matching the domain to its corresponding community_id.

Authentication Flow

For each community, we will check whether the user has an active session.

If logged in:

The navbar will display the profile dropdown, including an Admin Dashboard option (if the user has admin rights).

If not logged in:

The navbar will show Login and Signup buttons instead of the profile dropdown.

Landing Page Rendering

Regardless of authentication status, each domain will render the community-specific landing page.

The landing page will dynamically display sections based on the configuration stored in the database for that community_id.

Available Section Types
Communities can customize their landing page using predefined section types, including:

HeroSection – Full-screen hero with background image/video

Jumbotron – Simple hero with title and buttons

Gallery – Image gallery with multiple photos

InfoColumns – Information in column layout

ContactForm – Visitor contact form

Testimonials – Customer reviews and feedback

Features – Product or service feature highlights

Pricing – Pricing plans and packages