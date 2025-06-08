## Inspiration

Our team was inspired by the Socratic Method, a powerful, discussion-based teaching technique that encourages critical thinking through guided questioning. While it's recognized as one of the most effective ways to promote deep understanding, it's rarely used in classrooms today. Why? Because it requires a highly skilled educator to facilitate, and not every classroom has access to one.

With the rise of advanced AI models capable of natural language reasoning, we realized we could replicate the Socratic Method digitally. This sparked the idea for **Socratic** , a platform that brings Socratic-style learning to anyone, anywhere.

## What it does

Socratic uses generative AI to create personalized learning curriculums and simulate Socratic questioning around any topic. Users can input a subject and time frame, and Socratic generates a structured, multi-day curriculum complete with focused learning objectives. The platform is designed to engage users in thoughtful dialogue rather than rote memorization.

## How we built it

We built Socratic using Next.js and TypeScript, with backend services powered by Prisma and PostgreSQL. We used Google’s Gemini API for generative content and integrated session-based authentication for user-specific data.

Curriculums are generated dynamically using AI and stored persistently. We focused on building a smooth front-end experience, though due to time constraints, we were only able to complete the home page of the intended full UX.

## Challenges we ran into

We faced a number of technical and architectural challenges:
- Parsing structured JSON from AI reliably was difficult and required a lot of prompt tuning.
- Prisma and PostgreSQL sometimes caused race conditions, especially around querying and updating the database with concurrent requests.
- We had to rethink how to make AI-driven UX feel human, helpful, and conversational — not robotic.
- Time constraints meant we had to cut scope and simplify features we originally intended to build.

## Accomplishments that we're proud of

Despite the challenges, we’re proud of how much we accomplished in a short time. We successfully created a working pipeline for curriculum generation, handled authentication and persistence, and laid the foundation for a platform that could change how self-guided education is approached.

## What we learned

This project taught us a lot about:
- Prompt engineering and tuning AI outputs for consistency
- Working with AI APIs in a structured, programmatic environment
- Handling real-time data storage and user sessions securely
- Designing UX for AI-powered education

## What's next for Socratic

- Improve the design by making it consistent for a more immersive user experience  
- Tune the curriculum based on the user’s knowledge level  
- Support voice typing for more natural interaction
