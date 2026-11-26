export interface IQuote {
  name: string;
  text: string;
}

export const testimonialsDetails = {
  label: "Learner stories",
  heading: "What our learners say",
  allLabel: "Read all stories",
  role: "UKM learner",
  image: "/hero-student.png",
};

// Sample quotes for the demo. Replace with real learner feedback when you have it.
export const quotes: IQuote[] = [
  {
    name: "Amina Yusuf",
    text: "The lessons load quickly even on a weak connection, and I always know which lesson comes next.",
  },
  {
    name: "Chinedu Okafor",
    text: "I could see the fees and what I would learn before I enrolled. No surprises, and my certificate was ready when I finished.",
  },
  {
    name: "Fatima Bello",
    text: "Short lessons fit around my day. I study on my phone and pick up exactly where I stopped.",
  },
  {
    name: "Tunde Adeyemi",
    text: "The progress bar keeps me going. Seeing each module tick off made it easy to finish the course.",
  },
];
