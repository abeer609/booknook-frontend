# Taste

- Prefer minimal, straightforward implementations over elaborate components; when a simple element (e.g., an image) suffices, don't over-engineer. Confidence: 0.8
- Prefer shadcn/ui components over hand-rolled or third-party alternatives when they are already installed. Confidence: 0.7
- Prefer axios (via the shared axiosClient in lib/) over fetch for data fetching. Confidence: 0.9
- When a request involves auth, authorization, user verification, or password-related work, consult/activate the better-auth skill first. Confidence: 0.9
