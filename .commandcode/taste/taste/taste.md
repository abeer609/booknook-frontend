# Taste
- Prefer minimal, straightforward implementations over elaborate components; when a simple element (e.g., an image) suffices, don't over-engineer. Confidence: 0.8
- Prefer shadcn/ui components over hand-rolled or third-party alternatives when they are already installed. Confidence: 0.7
- Prefer axios (via the shared axiosClient in lib/) over fetch for data fetching. Confidence: 0.9
- When a request involves auth, authorization, user verification, or password-related work, consult/activate the better-auth skill first. Confidence: 0.9
- Prefer sonner's toast over browser alert() for user-facing notifications. Confidence: 0.8
- Use a loading spinner (e.g., lucide Loader2 with animate-spin via a shared Spinner component) instead of plain "Loading..." text for loading states. Confidence: 0.7
- In React client components, avoid useEffect calls that hit endpoints on every render/keystroke; use proper dependency arrays so network calls run only when intended (e.g., once on mount). Confidence: 0.8
