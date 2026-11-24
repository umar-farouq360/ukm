// All data here is fictitious demonstration data. No real people, institutions or accounts.
// The shapes below are deliberately API-ready: a real backend could return the same JSON later.

export type CategoryId = 'undergraduate' | 'masters' | 'postgraduate' | 'certificate'
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type LessonType = 'reading' | 'video' | 'activity'

export interface Category {
  id: CategoryId
  name: string
  short: string
  description: string
  who: string
}

export interface Lesson { id: string; title: string; type: LessonType; minutes: number }
export interface Module { id: string; title: string; lessons: Lesson[] }
export interface Instructor { id: string; name: string; title: string; bio: string }

export interface Course {
  id: string
  code: string
  title: string
  category: CategoryId
  subject: string
  level?: '100 Level' | '200 Level' | '300 Level'
  difficulty: Difficulty
  weeks: number
  hoursPerWeek: number
  price: number // Nigerian naira; 0 means free
  open: boolean
  instructorId: string
  summary: string
  description: string
  objectives: string[]
  outcomes: string[]
  prerequisites: string
  format: string
  popular?: boolean
  modules: Module[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'undergraduate',
    name: 'Undergraduate Programmes',
    short: 'Undergraduate',
    description: 'Degree-level courses taken year by year, with core courses allocated to your programme.',
    who: 'For students building a first degree.',
  },
  {
    id: 'masters',
    name: 'Masters Programmes',
    short: 'Masters',
    description: 'Advanced taught and research-methods courses for deepening your specialism.',
    who: 'For graduates moving into advanced study.',
  },
  {
    id: 'postgraduate',
    name: 'Postgraduate Programmes',
    short: 'Postgraduate',
    description: 'Postgraduate diploma and professional courses that extend an existing degree.',
    who: 'For graduates and practising professionals.',
  },
  {
    id: 'certificate',
    name: 'Certificate Programmes',
    short: 'Certificate',
    description: 'Short, practical courses you can finish in a few weeks, many of them free.',
    who: 'For young people and working professionals.',
  },
]

export const SUBJECTS = ['Computing', 'Data', 'Business', 'Health', 'Education', 'Communication', 'Mathematics'] as const

export const INSTRUCTORS: Instructor[] = [
  { id: 'i1', name: 'Dr. Ngozi Adeyemi-Bello', title: 'Senior Lecturer, Computing', bio: 'Teaches introductory programming and web fundamentals. Focuses on learning by building small, working things.' },
  { id: 'i2', name: 'Prof. Tunde Okafor-Lawal', title: 'Professor of Data Science', bio: 'Leads the data and machine learning courses. Known for explaining statistics with everyday examples.' },
  { id: 'i3', name: 'Mrs. Zainab Ibrahim-Musa', title: 'Lecturer, Business and Management', bio: 'Brings project delivery and management practice into the classroom for working professionals.' },
  { id: 'i4', name: 'Dr. Chidi Eze-Okonkwo', title: 'Lecturer, Public Health', bio: 'Teaches research methods and health data analysis with a focus on community-level evidence.' },
  { id: 'i5', name: 'Mr. Samuel Danjuma-Peters', title: 'Digital Skills Instructor', bio: 'Runs the short certificate programmes and designs them to work on slow connections and small screens.' },
  { id: 'i6', name: 'Dr. Aisha Garba-Nwosu', title: 'Senior Lecturer, Education', bio: 'Researches technology in teaching and leads the postgraduate education courses.' },
]

type Spec = [string, string[]][]

function buildModules(cid: string, spec: Spec): Module[] {
  return spec.map(([title, items], mi) => ({
    id: `m${mi + 1}`,
    title,
    lessons: items.map((raw, li) => {
      const type: LessonType = raw.startsWith('v:') ? 'video' : raw.startsWith('a:') ? 'activity' : 'reading'
      return {
        id: `${cid}-m${mi + 1}-l${li + 1}`,
        title: raw.replace(/^[vra]:/, ''),
        type,
        minutes: type === 'video' ? 8 : type === 'activity' ? 15 : 10,
      }
    }),
  }))
}

type CourseInput = Omit<Course, 'modules'> & { spec: Spec }
function c(input: CourseInput): Course {
  const { spec, ...rest } = input
  return { ...rest, modules: buildModules(input.id, spec) }
}

export const COURSES: Course[] = [
  // ---------------- Certificate ----------------
  c({
    id: 'cert-101', code: 'CERT-101', title: 'Digital Literacy Essentials', category: 'certificate', subject: 'Computing',
    difficulty: 'Beginner', weeks: 3, hoursPerWeek: 3, price: 0, open: true, instructorId: 'i5', popular: true,
    summary: 'Use a computer, the web and email with confidence, safely and efficiently.',
    description: 'A friendly start for anyone who wants to be comfortable with everyday digital tools. You will learn how to find reliable information online, manage files, write professional emails and stay safe from common scams. Every lesson is text-first and works on slow connections.',
    objectives: ['Navigate a computer and manage files and folders', 'Search the web and judge whether a source is reliable', 'Write and send clear, professional emails', 'Recognise and avoid common online scams'],
    outcomes: ['Complete everyday digital tasks without help', 'Protect your accounts with strong passwords'],
    prerequisites: 'None. Open to everyone.', format: 'Self-paced reading, short videos with transcripts, and practice activities.',
    spec: [
      ['Getting started with your device', ['Parts of a computer and how they work together', 'v:Files, folders and storage', 'a:Organise a practice folder']],
      ['Finding and judging information online', ['How search engines work', 'Spotting reliable sources', 'a:Fact-check a claim']],
      ['Email and staying safe', ['Writing a professional email', 'v:Passwords and two-step sign in', 'a:Spot the scam message']],
    ],
  }),
  c({
    id: 'cert-102', code: 'CERT-102', title: 'Web Design Basics: HTML and CSS', category: 'certificate', subject: 'Computing',
    difficulty: 'Beginner', weeks: 6, hoursPerWeek: 4, price: 0, open: true, instructorId: 'i1', popular: true,
    summary: 'Build and style your first web page from scratch.',
    description: 'Learn how web pages are structured and styled. You will write real HTML and CSS, make a page that works on phones and desktops, and understand the basics of accessible design.',
    objectives: ['Structure a page with semantic HTML', 'Style text, colour and layout with CSS', 'Make a layout respond to different screen sizes', 'Apply basic accessibility practices'],
    outcomes: ['Publish a simple personal web page', 'Read and adjust existing HTML and CSS'],
    prerequisites: 'Basic computer skills (see CERT-101).', format: 'Reading lessons with code examples, short videos and build activities.',
    spec: [
      ['HTML foundations', ['Elements, tags and attributes', 'v:Headings, lists and links', 'a:Build a profile page']],
      ['Styling with CSS', ['Selectors and the cascade', 'Colour, type and spacing', 'a:Style your profile page']],
      ['Responsive and accessible pages', ['v:Flexible layouts', 'Accessibility basics', 'a:Test on a small screen']],
    ],
  }),
  c({
    id: 'cert-110', code: 'CERT-110', title: 'Data Analysis with Spreadsheets', category: 'certificate', subject: 'Data',
    difficulty: 'Beginner', weeks: 5, hoursPerWeek: 3, price: 15000, open: true, instructorId: 'i2', popular: true,
    summary: 'Clean, summarise and chart data using formulas and pivot tables.',
    description: 'A practical course for professionals who work with numbers. You will tidy messy data, summarise it with formulas and pivot tables, and present findings in clear charts.',
    objectives: ['Clean and structure raw data', 'Use core formulas for summaries and lookups', 'Build pivot tables to answer questions', 'Choose and design clear charts'],
    outcomes: ['Produce a one-page data summary for decision makers'],
    prerequisites: 'Comfort using a computer. Any spreadsheet program works.', format: 'Reading lessons, worked examples and downloadable practice files.',
    spec: [
      ['Preparing your data', ['Rows, columns and clean data', 'v:Fixing common data problems', 'a:Clean the sample sales sheet']],
      ['Summarising with formulas', ['Sums, averages and counts', 'Lookups and conditions', 'a:Build a summary table']],
      ['Pivot tables and charts', ['v:Pivot tables step by step', 'Choosing the right chart', 'a:Present your findings']],
    ],
  }),
  c({
    id: 'cert-120', code: 'CERT-120', title: 'Professional Communication', category: 'certificate', subject: 'Communication',
    difficulty: 'Beginner', weeks: 4, hoursPerWeek: 2, price: 0, open: true, instructorId: 'i3',
    summary: 'Write, speak and present clearly in the workplace.',
    description: 'Short, practical training on the communication skills employers ask for: clear writing, confident speaking, active listening and giving feedback.',
    objectives: ['Write concise reports and messages', 'Prepare and deliver a short presentation', 'Listen actively and ask good questions', 'Give and receive feedback constructively'],
    outcomes: ['Communicate more confidently in meetings and interviews'],
    prerequisites: 'None.', format: 'Reading lessons, short videos and reflective activities.',
    spec: [
      ['Clear writing', ['Know your reader', 'Structuring a short report', 'a:Rewrite a long message']],
      ['Speaking and presenting', ['v:Planning a five-minute talk', 'Handling nerves', 'a:Outline your talk']],
      ['Listening and feedback', ['Active listening', 'Giving useful feedback', 'a:Reflect on a recent conversation']],
    ],
  }),
  c({
    id: 'cert-130', code: 'CERT-130', title: 'Project Management Fundamentals', category: 'certificate', subject: 'Business',
    difficulty: 'Intermediate', weeks: 6, hoursPerWeek: 4, price: 25000, open: true, instructorId: 'i3', popular: true,
    summary: 'Plan, schedule and deliver small projects on time and within budget.',
    description: 'Learn the core tools of project management: defining scope, building a schedule, managing risk and reporting progress. Designed for working professionals who lead small teams.',
    objectives: ['Define scope, goals and success measures', 'Break work into tasks and build a schedule', 'Identify and respond to risks', 'Report progress to stakeholders'],
    outcomes: ['Create a complete one-page project plan'],
    prerequisites: 'Some workplace experience is helpful but not required.', format: 'Reading lessons, case studies and planning activities.',
    spec: [
      ['Starting a project', ['What makes a project', 'v:Defining scope and goals', 'a:Write a project brief']],
      ['Planning the work', ['Work breakdown and estimates', 'Scheduling and dependencies', 'a:Build a simple schedule']],
      ['Delivering and reporting', ['Managing risk', 'v:Stakeholder updates', 'a:Create a status report']],
    ],
  }),

  // ---------------- Undergraduate ----------------
  c({
    id: 'csc-101', code: 'CSC-101', title: 'Introduction to Programming', category: 'undergraduate', subject: 'Computing', level: '100 Level',
    difficulty: 'Beginner', weeks: 12, hoursPerWeek: 5, price: 0, open: true, instructorId: 'i1', popular: true,
    summary: 'Learn to think computationally and write your first programs in Python.',
    description: 'The first programming course in the Computer Science programme. You will learn variables, decisions, loops and functions, and use them to solve small problems.',
    objectives: ['Explain what a program is and how it runs', 'Use variables, conditions and loops', 'Write and test simple functions', 'Break a problem into steps a computer can follow'],
    outcomes: ['Write programs of 50 to 100 lines that solve real problems'],
    prerequisites: 'None.', format: 'Weekly reading, short videos with transcripts and graded practice activities.',
    spec: [
      ['Thinking like a programmer', ['What is a program?', 'v:Your first Python program', 'a:Print a personal greeting']],
      ['Decisions and loops', ['Conditions with if and else', 'Repeating work with loops', 'a:Build a times-table printer']],
      ['Functions', ['Why functions matter', 'v:Writing and calling functions', 'a:Refactor with functions']],
      ['Solving problems', ['Planning before coding', 'Testing and debugging', 'a:Mini project: number guessing game']],
    ],
  }),
  c({
    id: 'csc-102', code: 'CSC-102', title: 'Computer Systems and Architecture', category: 'undergraduate', subject: 'Computing', level: '100 Level',
    difficulty: 'Intermediate', weeks: 12, hoursPerWeek: 4, price: 0, open: true, instructorId: 'i1',
    summary: 'How computers represent data, run programs and are organised.',
    description: 'Understand what happens inside a computer: number systems, logic, memory and the processor. A foundation for later courses in operating systems and networks.',
    objectives: ['Convert between binary, decimal and hexadecimal', 'Explain basic logic gates and circuits', 'Describe how a processor runs instructions', 'Compare types of memory and storage'],
    outcomes: ['Explain the journey of an instruction from storage to execution'],
    prerequisites: 'Recommended alongside CSC-101.', format: 'Reading lessons, diagrams and problem sets.',
    spec: [
      ['Representing data', ['Number systems', 'v:Binary and hexadecimal', 'a:Conversion drills']],
      ['Logic and circuits', ['Logic gates', 'Truth tables', 'a:Design a simple circuit']],
      ['The processor and memory', ['Fetch, decode, execute', 'Memory hierarchy', 'a:Trace an instruction']],
    ],
  }),
  c({
    id: 'mth-101', code: 'MTH-101', title: 'Discrete Mathematics', category: 'undergraduate', subject: 'Mathematics', level: '100 Level',
    difficulty: 'Intermediate', weeks: 12, hoursPerWeek: 4, price: 0, open: true, instructorId: 'i2',
    summary: 'Sets, logic, counting and graphs: the mathematics behind computing.',
    description: 'An introduction to the mathematical ideas that computing is built on, with an emphasis on clear reasoning and proof.',
    objectives: ['Work with sets, relations and functions', 'Use propositional logic to reason', 'Solve basic counting problems', 'Model problems with graphs'],
    outcomes: ['Construct and check simple proofs'],
    prerequisites: 'Secondary school mathematics.', format: 'Reading lessons with worked examples and problem sets.',
    spec: [
      ['Sets and logic', ['Sets and operations', 'v:Propositional logic', 'a:Logic problem set']],
      ['Counting', ['Permutations and combinations', 'a:Counting problems']],
      ['Graphs', ['Graphs and trees', 'a:Model a road network']],
    ],
  }),
  c({
    id: 'bus-201', code: 'BUS-201', title: 'Principles of Management', category: 'undergraduate', subject: 'Business', level: '200 Level',
    difficulty: 'Intermediate', weeks: 12, hoursPerWeek: 4, price: 20000, open: true, instructorId: 'i3',
    summary: 'Planning, organising, leading and controlling in modern organisations.',
    description: 'A foundation course in management theory and practice, with case studies from small enterprises and public organisations.',
    objectives: ['Describe the main management functions', 'Compare leadership styles', 'Apply planning tools to a case', 'Explain how organisations are structured'],
    outcomes: ['Analyse a short management case and recommend actions'],
    prerequisites: 'None.', format: 'Reading lessons, case studies and discussion activities.',
    spec: [
      ['Management in context', ['What managers do', 'v:Evolution of management thought', 'a:Interview a manager']],
      ['Planning and organising', ['Setting goals', 'Organisational structure', 'a:Draw an org chart']],
      ['Leading and controlling', ['Leadership styles', 'Motivation', 'a:Case analysis']],
    ],
  }),

  // ---------------- Masters ----------------
  c({
    id: 'msc-501', code: 'MSC-501', title: 'Research Methods and Academic Writing', category: 'masters', subject: 'Education',
    difficulty: 'Advanced', weeks: 10, hoursPerWeek: 6, price: 45000, open: true, instructorId: 'i4',
    summary: 'Design a rigorous study and write it up to a postgraduate standard.',
    description: 'Learn how to frame a research question, choose methods, collect and analyse evidence, and write clearly and ethically at Masters level.',
    objectives: ['Frame a focused research question', 'Compare qualitative and quantitative designs', 'Plan ethical data collection', 'Structure and reference an academic report'],
    outcomes: ['Produce a complete research proposal'],
    prerequisites: 'A first degree or equivalent.', format: 'Reading lessons, seminar-style activities and a proposal project.',
    spec: [
      ['Research design', ['From topic to question', 'v:Qualitative and quantitative designs', 'a:Draft your research question']],
      ['Evidence and ethics', ['Sampling and data collection', 'Research ethics', 'a:Write an ethics statement']],
      ['Writing it up', ['Structuring a report', 'Referencing and integrity', 'a:Outline your proposal']],
    ],
  }),
  c({
    id: 'msc-510', code: 'MSC-510', title: 'Applied Machine Learning', category: 'masters', subject: 'Data',
    difficulty: 'Advanced', weeks: 12, hoursPerWeek: 6, price: 60000, open: true, instructorId: 'i2', popular: true,
    summary: 'Build, evaluate and responsibly deploy machine learning models.',
    description: 'A hands-on Masters course covering supervised and unsupervised learning, evaluation and responsible use of data.',
    objectives: ['Frame problems as machine learning tasks', 'Train and evaluate classification and regression models', 'Avoid leakage and overfitting', 'Discuss bias and responsible use'],
    outcomes: ['Deliver an end-to-end model with an honest evaluation'],
    prerequisites: 'Programming experience and introductory statistics.', format: 'Reading lessons, notebooks and a capstone project.',
    spec: [
      ['Foundations', ['Machine learning problem types', 'v:Training and testing data', 'a:Split a dataset correctly']],
      ['Models and evaluation', ['Regression and classification', 'Metrics that matter', 'a:Compare two models']],
      ['Responsible practice', ['Bias and fairness', 'a:Write a model card']],
    ],
  }),
  c({
    id: 'msc-520', code: 'MSC-520', title: 'Health Data Analysis', category: 'masters', subject: 'Health',
    difficulty: 'Advanced', weeks: 10, hoursPerWeek: 5, price: 50000, open: true, instructorId: 'i4',
    summary: 'Analyse community health data and communicate evidence to decision makers.',
    description: 'Use statistics and clear visuals to understand health patterns, with attention to data quality, privacy and ethics.',
    objectives: ['Describe health data with summary statistics', 'Interpret rates, risks and trends', 'Protect privacy in health data', 'Present evidence for policy decisions'],
    outcomes: ['Write a short evidence brief from a health dataset'],
    prerequisites: 'A first degree; basic statistics helpful.', format: 'Reading lessons, case datasets and a brief-writing project.',
    spec: [
      ['Health data basics', ['Sources and quality', 'v:Rates, risks and ratios', 'a:Interpret a rate table']],
      ['Analysis', ['Trends over time', 'Comparing groups', 'a:Analyse a sample dataset']],
      ['Communicating evidence', ['Privacy and ethics', 'a:Write an evidence brief']],
    ],
  }),

  // ---------------- Postgraduate ----------------
  c({
    id: 'pgd-601', code: 'PGD-601', title: 'Educational Technology in Practice', category: 'postgraduate', subject: 'Education',
    difficulty: 'Intermediate', weeks: 8, hoursPerWeek: 5, price: 40000, open: true, instructorId: 'i6',
    summary: 'Choose and use digital tools to improve teaching and learning.',
    description: 'For teachers and trainers who want to use technology purposefully, including in low-bandwidth settings.',
    objectives: ['Match tools to learning goals', 'Design an online lesson', 'Support learners with limited connectivity', 'Evaluate whether a tool improves learning'],
    outcomes: ['Design and pilot a short online lesson'],
    prerequisites: 'A first degree or teaching experience.', format: 'Reading lessons, design activities and peer review.',
    spec: [
      ['Learning and technology', ['Principles of effective online learning', 'v:Choosing the right tool', 'a:Audit a tool you use']],
      ['Designing online lessons', ['Lesson structure', 'Low-bandwidth design', 'a:Design a 20-minute lesson']],
      ['Evaluating impact', ['Measuring learning', 'a:Plan an evaluation']],
    ],
  }),
  c({
    id: 'pgd-610', code: 'PGD-610', title: 'Data Management for Organisations', category: 'postgraduate', subject: 'Data',
    difficulty: 'Intermediate', weeks: 8, hoursPerWeek: 5, price: 42000, open: true, instructorId: 'i2',
    summary: 'Keep organisational data accurate, secure and useful.',
    description: 'Learn how organisations collect, store, protect and use data, including privacy duties under data protection law.',
    objectives: ['Design simple data collection forms', 'Describe how data is stored and backed up', 'Explain data protection principles', 'Create a basic data governance plan'],
    outcomes: ['Produce a data governance checklist for your organisation'],
    prerequisites: 'A first degree or workplace experience.', format: 'Reading lessons, case studies and planning activities.',
    spec: [
      ['Collecting data well', ['Good data starts with good forms', 'a:Redesign a form']],
      ['Storing and protecting data', ['v:Storage, backup and access', 'Data protection principles', 'a:Risk check']],
      ['Governance', ['Roles and responsibilities', 'a:Write a governance checklist']],
    ],
  }),
  c({
    id: 'pgd-620', code: 'PGD-620', title: 'Leadership in Public Institutions', category: 'postgraduate', subject: 'Business',
    difficulty: 'Advanced', weeks: 10, hoursPerWeek: 5, price: 55000, open: false, instructorId: 'i3',
    summary: 'Lead teams and manage change in public-sector settings.',
    description: 'Explore leadership, accountability and change management in public institutions. The current intake has closed; the next intake opens in the new year.',
    objectives: ['Compare leadership approaches', 'Plan and communicate organisational change', 'Apply accountability frameworks', 'Manage stakeholders'],
    outcomes: ['Develop a change plan for a public institution'],
    prerequisites: 'A first degree and three years of work experience.', format: 'Reading lessons, case discussions and a change-plan project.',
    spec: [
      ['Leading in public institutions', ['Leadership approaches', 'a:Self-assessment']],
      ['Managing change', ['v:Why change fails', 'a:Draft a change plan']],
    ],
  }),
]

export const courseById = (id: string) => COURSES.find((x) => x.id === id)
export const instructorById = (id: string) => INSTRUCTORS.find((x) => x.id === id)!
export const categoryById = (id: CategoryId) => CATEGORIES.find((x) => x.id === id)!
export const allLessons = (course: Course) => course.modules.flatMap((m) => m.lessons)

export const naira = (n: number) => (n === 0 ? 'Free' : `₦${n.toLocaleString('en-NG')}`)

/** Programme options offered at registration. Choosing one allocates core courses automatically. */
export const PROGRAMMES = [
  { id: 'none', label: 'I am exploring (no programme yet)', allocated: [] as string[] },
  { id: 'bsc-csc-100', label: 'B.Sc. Computer Science, 100 Level', allocated: ['csc-101', 'csc-102', 'mth-101'] },
]

/** Lesson body text. Sample content generated from each course's own objectives. */
export function lessonBody(course: Course, moduleTitle: string, lesson: Lesson): { paragraphs: string[]; points: string[]; transcript?: string } {
  const idx = allLessons(course).findIndex((l) => l.id === lesson.id)
  const obj = course.objectives[idx % course.objectives.length]
  const base = [
    `This lesson sits in the module "${moduleTitle}" of ${course.title}. By the end you should be closer to this goal: ${obj.charAt(0).toLowerCase()}${obj.slice(1)}.`,
    `Take your time. Read each section once for the big idea, then again to note anything you want to ask the assistant or your instructor. You can leave and return at any point; your place is saved.`,
  ]
  const points = [
    `Focus: ${lesson.title}`,
    `Estimated time: about ${lesson.minutes} minutes`,
    'Mark the lesson complete when you are ready to move on',
  ]
  if (lesson.type === 'video') {
    return {
      paragraphs: base,
      points,
      transcript: `Transcript (demo). In this short video we introduce "${lesson.title}". We start with the key idea, walk through one worked example, and finish with a quick summary of what to remember. Everything said in the video is also written here, so you can read it instead if your connection is slow.`,
    }
  }
  if (lesson.type === 'activity') {
    return {
      paragraphs: [
        `Practice activity: ${lesson.title}. Work through the steps below on your own, then write a few notes about what you did and what you found difficult.`,
        'There is no automatic marking in this demonstration. Honest reflection is the point.',
      ],
      points: ['Read the task carefully', 'Attempt it without looking at the notes', 'Write two or three sentences about what you learned'],
    }
  }
  return { paragraphs: base, points }
}
