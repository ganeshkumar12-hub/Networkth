import { UserProfile, Community, Opportunity } from '../src/types';

export const initialUsers: (UserProfile & { passwordHash: string })[] = [
  {
    id: 'user_1',
    name: 'Elena Rostova',
    email: 'elena@synthai.io',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O', // 'password123'
    role: 'Founder',
    headline: 'Founder & CEO at SynthAI (YC W24) | Building Next-Gen Agent Workflows',
    bio: 'Former AI researcher at DeepMind turned founder. Building autonomous developer infrastructure. Seeking early feedback from developers, community partnerships, and senior infrastructure engineers.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    industry: 'Artificial Intelligence',
    skills: ['AI/ML', 'Product Strategy', 'Fundraising', 'Python', 'Agentic Systems'],
    interests: ['DevTools', 'Autonomous Agents', 'Open Source', 'Scaling Startups'],
    experience: [
      {
        id: 'exp_1',
        title: 'Founder & CEO',
        company: 'SynthAI',
        period: '2023 - Present',
        description: 'Leading a team of 14 building enterprise autonomous agents for software workflows. Backed by Y Combinator.'
      },
      {
        id: 'exp_2',
        title: 'Senior Research Scientist',
        company: 'DeepMind',
        period: '2020 - 2023',
        description: 'Conducted frontier research on large language model reasoning and multi-modal alignment.'
      }
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'M.S. in Computer Science',
        school: 'Stanford University',
        year: '2020'
      }
    ],
    communities: ['AI Builders Global', 'YC Alumni & Founders', 'Next-Gen Infrastructure'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      website: 'https://synthai.io'
    },
    connectionCount: 342,
    status: 'active',
    availability: 'Collaborating',
    createdAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'user_2',
    name: 'David Vance',
    email: 'david.vance@techcorp.com',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Working Professional',
    headline: 'Principal Infrastructure Engineer at Stripe | Distributed Systems & High Scale',
    bio: '12+ years designing mission-critical distributed payment systems. Passionate about mentoring students and early-career engineers transitioning from academia to production systems.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    location: 'Seattle, WA',
    industry: 'Fintech & Cloud Infrastructure',
    skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Architecture', 'Mentorship', 'Java'],
    interests: ['Financial Systems', 'Career Growth', 'Cloud Architecture', 'Engineering Leadership'],
    experience: [
      {
        id: 'exp_3',
        title: 'Principal Engineer',
        company: 'Stripe',
        period: '2021 - Present',
        description: 'Architecting global ledger consistency and payment settlement pipelines handling tens of billions in volume.'
      },
      {
        id: 'exp_4',
        title: 'Staff Software Engineer',
        company: 'Amazon Web Services',
        period: '2016 - 2021',
        description: 'Core developer on DynamoDB replication subsystem.'
      }
    ],
    education: [
      {
        id: 'edu_2',
        degree: 'B.S. in Electrical Engineering & CS',
        school: 'UC Berkeley',
        year: '2015'
      }
    ],
    communities: ['Distributed Systems Guild', 'Tech Mentors Alliance'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    connectionCount: 890,
    status: 'active',
    availability: 'Mentoring',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'user_3',
    name: 'Maya Chen',
    email: 'mayachen@stanford.edu',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Student',
    headline: 'CS & Math Senior @ Stanford | Aspiring ML Researcher | Lead @ Stanford AI Club',
    bio: 'Final year undergraduate exploring efficient transformer architectures and reinforcement learning. Seeking guidance from industry professionals, mentorship on research publication, and startup collaborations.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    location: 'Palo Alto, CA',
    industry: 'Computer Science Education',
    skills: ['PyTorch', 'Python', 'Algorithms', 'Linear Algebra', 'Transformers', 'React'],
    interests: ['Machine Learning', 'Research Internships', 'Campus Tech Leadership', 'EdTech'],
    experience: [
      {
        id: 'exp_5',
        title: 'Undergraduate Research Fellow',
        company: 'Stanford AI Lab (SAIL)',
        period: '2024 - Present',
        description: 'Working on mechanistic interpretability for medium-sized language models.'
      },
      {
        id: 'exp_6',
        title: 'Software Engineering Intern',
        company: 'Scale AI',
        period: 'Summer 2024',
        description: 'Built automated annotation evaluation pipelines for RLHF datasets.'
      }
    ],
    education: [
      {
        id: 'edu_3',
        degree: 'B.S. in Computer Science & Applied Math',
        school: 'Stanford University',
        year: '2026'
      }
    ],
    communities: ['Stanford AI Club', 'Campus Startup Collective', 'AI Builders Global'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    connectionCount: 215,
    status: 'active',
    availability: 'Open to Connect',
    createdAt: '2025-02-01T12:00:00.000Z'
  },
  {
    id: 'user_4',
    name: 'Alex Rivera',
    email: 'alex@creativetech.media',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Creator',
    headline: 'Tech Creator & Video Essayist (480K Audience) | Modern DevTools & AI Workflows',
    bio: 'Demystifying complex modern software architectures, open-source projects, and frontier developer tools through in-depth video essays. Collaborating with developer-first brands and authentic technology startups.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    industry: 'Media & Creator Economy',
    skills: ['Video Production', 'Developer Storytelling', 'Technical Writing', 'Audience Growth', 'Product Reviews'],
    interests: ['DevTools', 'Developer Experience', 'Hardware', 'Community Building'],
    experience: [
      {
        id: 'exp_7',
        title: 'Creator & Host',
        company: 'Rivera Code & Culture',
        period: '2021 - Present',
        description: 'Produced 120+ technical deep-dives reaching over 20M views across YouTube, podcasts, and newsletter.'
      }
    ],
    education: [
      {
        id: 'edu_4',
        degree: 'B.A. in Digital Media & Communications',
        school: 'UT Austin',
        year: '2019'
      }
    ],
    communities: ['Creator Tech Guild', 'DevRel Alliance'],
    socialLinks: {
      twitter: 'https://twitter.com',
      website: 'https://creativetech.media'
    },
    connectionCount: 620,
    status: 'active',
    availability: 'Collaborating',
    createdAt: '2025-01-20T14:00:00.000Z'
  },
  {
    id: 'user_5',
    name: 'Lumina Cloud',
    email: 'partnerships@luminacloud.com',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Brand',
    headline: 'Developer Cloud Platform | Sponsoring Tech Creators, Hackathons & Communities',
    bio: 'High-performance cloud compute for AI developers and modern full-stack web applications. We actively sponsor authentic technical creators, collegiate developer clubs, and open-source tooling.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    industry: 'Cloud Infrastructure & Developer Tools',
    skills: ['Cloud Computing', 'Developer Marketing', 'Sponsorships', 'Community Partnerships'],
    interests: ['Creator Sponsorships', 'Hackathon Grants', 'DevRel', 'GPU Infrastructure'],
    experience: [
      {
        id: 'exp_8',
        title: 'Developer Platform',
        company: 'Lumina Cloud Inc.',
        period: '2022 - Present',
        description: 'Empowering over 80,000 developers with ultra-fast edge serverless deployments and GPU clusters.'
      }
    ],
    education: [],
    communities: ['DevRel Alliance', 'Campus Startup Collective', 'AI Builders Global'],
    socialLinks: {
      website: 'https://luminacloud.com',
      twitter: 'https://twitter.com'
    },
    connectionCount: 410,
    status: 'active',
    availability: 'Collaborating',
    createdAt: '2025-01-05T09:00:00.000Z'
  },
  {
    id: 'user_6',
    name: 'Marcus Thorne',
    email: 'marcus@systemsdev.io',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Developer',
    headline: 'Senior Rust & Systems Engineer | Open Source Contributor | Low-Latency Networking',
    bio: 'Obsessed with zero-cost abstractions, memory safety, and high-throughput networking. Looking to connect with early-stage infrastructure founders and like-minded systems hackers.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    location: 'Berlin, Germany',
    industry: 'Systems Programming',
    skills: ['Rust', 'C++', 'Linux Kernel', 'eBPF', 'Tokio', 'Distributed Systems'],
    interests: ['Low-Latency', 'Compilers', 'Open Source Networking', 'Cybersecurity'],
    experience: [
      {
        id: 'exp_9',
        title: 'Lead Systems Engineer',
        company: 'VectorIO',
        period: '2022 - Present',
        description: 'Created a sub-millisecond real-time event streaming broker in Rust.'
      }
    ],
    education: [
      {
        id: 'edu_5',
        degree: 'B.Sc. in Computer Systems',
        school: 'TU Munich',
        year: '2021'
      }
    ],
    communities: ['Rustaceans World', 'Distributed Systems Guild'],
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    connectionCount: 310,
    status: 'active',
    availability: 'Open to Connect',
    createdAt: '2025-02-10T11:00:00.000Z'
  },
  {
    id: 'user_7',
    name: 'Sarah Jenkins',
    email: 'sarah@productcraft.design',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Mentor / Industry Expert',
    headline: 'VP of Product Design @ Fintech Unicorn | Design Mentor | Angel Investor',
    bio: '15 years leading product design organizations. Helping young designers, student founders, and early product teams transition from raw concepts into loved product experiences.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    location: 'London, UK',
    industry: 'Product Design & Strategy',
    skills: ['Product Design', 'UX Research', 'Design Systems', 'Team Leadership', 'Mentorship'],
    interests: ['Product Strategy', 'Fintech', 'Design Education', 'Venture Mentorship'],
    experience: [
      {
        id: 'exp_10',
        title: 'VP of Product Design',
        company: 'Moneta Global',
        period: '2020 - Present',
        description: 'Overseeing global product design org across web, mobile, and merchant tools.'
      }
    ],
    education: [
      {
        id: 'edu_6',
        degree: 'M.A. in Human-Computer Interaction',
        school: 'Royal College of Art',
        year: '2012'
      }
    ],
    communities: ['Design Engineering Circle', 'Tech Mentors Alliance'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    connectionCount: 780,
    status: 'active',
    availability: 'Mentoring',
    createdAt: '2025-01-08T16:00:00.000Z'
  },
  {
    id: 'user_8',
    name: 'PulseMetrics',
    email: 'team@pulsemetrics.dev',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Startup',
    headline: 'Real-time telemetry and API observability built for developer teams',
    bio: 'Zero-config observability for Node.js, Python, and Go microservices. Currently in closed beta looking for developer feedback, startup beta testers, and student hackathon teams.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    location: 'Boston, MA',
    industry: 'Developer Tools & SaaS',
    skills: ['APIs', 'Observability', 'Metrics', 'Developer Experience'],
    interests: ['Beta Testing', 'DevRel', 'Product Feedback', 'Campus Hackathons'],
    experience: [],
    education: [],
    communities: ['Next-Gen Infrastructure', 'Campus Startup Collective'],
    socialLinks: {
      website: 'https://pulsemetrics.dev',
      github: 'https://github.com'
    },
    connectionCount: 195,
    status: 'active',
    availability: 'Collaborating',
    createdAt: '2025-02-15T10:00:00.000Z'
  },
  {
    id: 'user_9',
    name: 'Karan Patel',
    email: 'karan@vectormesh.ai',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Founder',
    headline: 'Co-Founder @ VectorMesh (YC S24) | High-Performance Vector Search Engine',
    bio: 'Building the fastest distributed vector indexing engine in Rust and C++. Seeking early beta design partners, campus dev leads, and seed-stage angel network.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    industry: 'Artificial Intelligence & Infrastructure',
    skills: ['Rust', 'Vector Databases', 'Distributed Systems', 'Founders', 'AI/ML'],
    interests: ['Database Internals', 'YC Founders', 'Early Adopters', 'Hackathons'],
    experience: [
      {
        id: 'exp_9_1',
        title: 'Co-Founder & CEO',
        company: 'VectorMesh',
        period: '2024 - Present',
        description: 'Building vector search infrastructure backed by YC and top infrastructure angels.'
      }
    ],
    education: [
      {
        id: 'edu_9_1',
        degree: 'B.S. in Computer Engineering',
        school: 'University of Texas at Austin',
        year: '2022'
      }
    ],
    communities: ['AI Builders Global', 'Distributed Systems Guild'],
    socialLinks: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      website: 'https://vectormesh.ai'
    },
    connectionCount: 280,
    status: 'active',
    availability: 'Hiring',
    createdAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'user_10',
    name: 'Lucas Kim',
    email: 'lucas.kim@mit.edu',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Student',
    headline: 'EECS Junior @ MIT | Open-Source Systems Hacker & HackMIT Winner',
    bio: 'Junior studying computer science and hardware architectures at MIT. Built an open-source WASM micro-runtime. Looking for summer 2026 systems engineering internships and senior mentor relationships.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    location: 'Cambridge, MA',
    industry: 'Higher Education & Systems Software',
    skills: ['Rust', 'C++', 'WebAssembly', 'Compilers', 'Linux Internals'],
    interests: ['Low-Level Engineering', 'Internships', 'Hackathons', 'Mentorship'],
    experience: [
      {
        id: 'exp_10_1',
        title: 'Systems Research Intern',
        company: 'MIT CSAIL',
        period: '2024 - Present',
        description: 'Conducting compiler optimization benchmarks on custom RISC-V simulators.'
      }
    ],
    education: [
      {
        id: 'edu_10_1',
        degree: 'B.S. in Electrical Engineering and Computer Science',
        school: 'Massachusetts Institute of Technology',
        year: '2026'
      }
    ],
    communities: ['Campus Startup Collective', 'Distributed Systems Guild'],
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    connectionCount: 140,
    status: 'active',
    availability: 'Open to Connect',
    createdAt: '2025-01-22T12:00:00.000Z'
  },
  {
    id: 'user_11',
    name: 'Rachel Torres',
    email: 'rachel.torres@figma.com',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Working Professional',
    headline: 'Staff Design Engineer @ Figma | Ex-Airbnb | Design Systems & WebGL',
    bio: '10+ years shaping collaborative canvas interactions and design systems at scale. Excited to mentor aspiring design engineers and advise early-stage creative tooling founders.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    location: 'New York, NY',
    industry: 'Design Technology & SaaS',
    skills: ['TypeScript', 'Design Systems', 'WebGL', 'React', 'Mentorship', 'UI Architecture'],
    interests: ['Canvas Performance', 'Design Engineering', 'Mentoring Students', 'Women in Tech'],
    experience: [
      {
        id: 'exp_11_1',
        title: 'Staff Design Engineer',
        company: 'Figma',
        period: '2022 - Present',
        description: 'Leading the Canvas rendering and design tokens pipeline across Web and Desktop apps.'
      },
      {
        id: 'exp_11_2',
        title: 'Senior Frontend Architect',
        company: 'Airbnb',
        period: '2017 - 2022',
        description: 'Core architect of Lunar Design System and design token compiler.'
      }
    ],
    education: [
      {
        id: 'edu_11_1',
        degree: 'B.S. in Human-Computer Interaction',
        school: 'Carnegie Mellon University',
        year: '2015'
      }
    ],
    communities: ['Design Engineering Circle', 'Tech Mentors Alliance'],
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    },
    connectionCount: 460,
    status: 'active',
    availability: 'Mentoring',
    createdAt: '2025-01-18T15:00:00.000Z'
  },
  {
    id: 'user_12',
    name: 'Jordan Lee',
    email: 'jordan@systemsdecoded.io',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Creator',
    headline: 'Creator of "Systems Decoded" (185k Developers on YouTube & Substack)',
    bio: 'Breaking down massive real-world architectures (Netflix, Discord, Cloudflare) with animated diagrams and deep code dives. Looking to collaborate with developer-first brands and infrastructure startups.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    location: 'London, UK',
    industry: 'Developer Media & Education',
    skills: ['Video Production', 'Technical Writing', 'Architecture Breakdowns', 'Developer Education', 'Sponsorships'],
    interests: ['Distributed Systems', 'Brand Deals', 'Podcasting', 'Open Source Spotlights'],
    experience: [
      {
        id: 'exp_12_1',
        title: 'Lead Educator & Producer',
        company: 'Systems Decoded Media',
        period: '2021 - Present',
        description: 'Created 80+ in-depth technical videos reaching over 6 million software engineers.'
      }
    ],
    education: [
      {
        id: 'edu_12_1',
        degree: 'B.Eng in Software Engineering',
        school: 'Imperial College London',
        year: '2019'
      }
    ],
    communities: ['DevRel Alliance', 'Distributed Systems Guild'],
    socialLinks: {
      twitter: 'https://twitter.com',
      website: 'https://systemsdecoded.io',
      github: 'https://github.com'
    },
    connectionCount: 520,
    status: 'active',
    availability: 'Collaborating',
    createdAt: '2025-01-25T11:00:00.000Z'
  },
  {
    id: 'user_13',
    name: 'CloudPulse Labs',
    email: 'partners@cloudpulse.io',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Brand',
    headline: 'Next-Gen Serverless Compute Platform | Sponsoring Tech Creators & Hackathons',
    bio: 'CloudPulse gives developers instant edge compute with sub-millisecond cold starts. We sponsor technical content creators, collegiate hackathons, and open source maintainers.',
    avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    industry: 'Cloud Computing & Developer Tools',
    skills: ['Cloud Infrastructure', 'Developer Marketing', 'Hackathons', 'Sponsorships', 'DevRel'],
    interests: ['Creator Partnerships', 'Student Hackathons', 'Developer Advocacy', 'Edge Compute'],
    experience: [],
    education: [],
    communities: ['DevRel Alliance', 'Next-Gen Infrastructure'],
    socialLinks: {
      website: 'https://cloudpulse.io',
      twitter: 'https://twitter.com'
    },
    connectionCount: 310,
    status: 'active',
    availability: 'Hiring',
    createdAt: '2025-02-01T09:00:00.000Z'
  },
  {
    id: 'user_admin',
    name: 'Networkth Admin',
    email: 'admin@networkth.com',
    passwordHash: '$2a$10$wK1Wk9iU7Y6kH7t.sK8qEu3kX.Vz1Oq8rZJ6Uu6iP6E4jJk4t1R9O',
    role: 'Working Professional',
    headline: 'System Administrator & Trust & Safety Lead @ Networkth',
    bio: 'Platform administration, trust and safety, community moderation and discovery algorithms.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    industry: 'Platform Operations',
    skills: ['Operations', 'Platform Safety', 'Moderation', 'Community Relations'],
    interests: ['Discovery Algorithms', 'Trust & Safety', 'Network Growth'],
    experience: [],
    education: [],
    communities: ['AI Builders Global', 'Design Engineering Circle'],
    socialLinks: {
      website: 'https://networkth.com'
    },
    connectionCount: 1200,
    status: 'active',
    isAdmin: true,
    availability: 'Open to Connect',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

export const initialCommunities: Community[] = [
  {
    id: 'comm_1',
    name: 'AI Builders Global',
    category: 'AI & Machine Learning',
    description: 'A global network of machine learning researchers, founders, and engineers building practical applications with LLMs, diffusion models, and autonomous agents.',
    memberCount: 8420,
    tags: ['AI', 'LLMs', 'PyTorch', 'Agents', 'Research'],
    topics: ['Model Fine-Tuning', 'Agentic Workflows', 'Evaluation', 'Inference Optimizations'],
    audience: 'Engineers, AI Researchers, Technical Founders',
    website: 'https://aibuilders.network',
    ownerId: 'user_1',
    ownerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-blue-600 via-indigo-600 to-violet-700'
  },
  {
    id: 'comm_2',
    name: 'Campus Startup Collective',
    category: 'College & Students',
    description: 'Connecting collegiate builders, student founders, and aspiring startup operators across top universities worldwide with seasoned mentors and seed investors.',
    memberCount: 6150,
    tags: ['College', 'Founders', 'Mentorship', 'Student Startups', 'Hackathons'],
    topics: ['First Customers', 'Campus Ambassadorship', 'Pitching', 'Technical Co-Founders'],
    audience: 'University Students, Student Founders, Recent Graduates',
    website: 'https://campusstartup.network',
    ownerId: 'user_3',
    ownerName: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-amber-500 via-orange-600 to-rose-600'
  },
  {
    id: 'comm_3',
    name: 'DevRel Alliance',
    category: 'Developer Relations',
    description: 'The premier community for Developer Advocates, Developer Marketing leaders, and technical content creators bridging products with engineering teams.',
    memberCount: 3890,
    tags: ['DevRel', 'Community', 'Technical Writing', 'Developer Experience'],
    topics: ['Campus Activations', 'Developer Content', 'Hackathon Sponsoring', 'SDK Feedback'],
    audience: 'DevRel Managers, Developer Advocates, Technical Creators',
    website: 'https://devrelalliance.org',
    ownerId: 'user_4',
    ownerName: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-700'
  },
  {
    id: 'comm_4',
    name: 'Design Engineering Circle',
    category: 'Design & Frontend',
    description: 'Where craft meets code. A community of product designers who code, UI engineers, and design system creators obsessing over micro-interactions and polish.',
    memberCount: 5240,
    tags: ['Design Systems', 'Figma', 'React', 'Motion', 'Craft'],
    topics: ['Interaction Design', 'CSS Architecture', 'Component Libraries', 'Accessibility'],
    audience: 'Design Engineers, Product Designers, Frontend Leads',
    website: 'https://designengineers.co',
    ownerId: 'user_7',
    ownerName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-fuchsia-600 via-purple-600 to-indigo-700'
  },
  {
    id: 'comm_5',
    name: 'Distributed Systems Guild',
    category: 'Engineering & Architecture',
    description: 'Deep technical discussions on consensus algorithms, high-throughput message brokers, database internals, and zero-downtime planetary scale architectures.',
    memberCount: 4620,
    tags: ['Distributed Systems', 'Go', 'Rust', 'Cloud Infrastructure', 'Storage'],
    topics: ['Raft/Paxos', 'Database Engines', 'eBPF', 'Fault Tolerance'],
    audience: 'Staff Engineers, Infrastructure Architects, Systems Devs',
    website: 'https://distributedsystems.dev',
    ownerId: 'user_2',
    ownerName: 'David Vance',
    avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-slate-700 via-cyan-800 to-blue-900'
  },
  {
    id: 'comm_6',
    name: 'Tech Mentors Alliance',
    category: 'Mentorship & Career',
    description: 'Experienced engineering directors, VPs, and principal practitioners offering structured career guidance, mock interviews, and technical roadmaps.',
    memberCount: 2950,
    tags: ['Mentorship', 'Career Guidance', 'Mock Interviews', 'Leadership'],
    topics: ['Senior Promotion Paths', 'Navigating Big Tech', 'From IC to Lead', 'Resume Reviews'],
    audience: 'Mentors, Early-Career Engineers, Graduating Students',
    website: 'https://techmentors.org',
    ownerId: 'user_2',
    ownerName: 'David Vance',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80',
    bannerGradient: 'from-sky-600 via-blue-700 to-indigo-800'
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'Closed Beta Testers for Real-time Observability SDK',
    type: 'Early Access',
    creatorName: 'PulseMetrics',
    creatorRole: 'Observability Startup',
    creatorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    companyOrOrg: 'PulseMetrics',
    description: 'Looking for 15 engineering teams building microservices to test our lightweight telemetry agent. Offering lifetime free tier and direct Slack channel with our founders.',
    tags: ['Beta Testing', 'DevOps', 'Observability', 'Free Tier'],
    targetAudiences: ['Developers', 'Startups', 'Working Professionals'],
    location: 'Remote',
    linkText: 'Apply for Beta Access',
    createdAt: '2025-02-18T10:00:00.000Z'
  },
  {
    id: 'opp_2',
    title: 'Bi-Weekly Mentorship for Students in Systems & AI',
    type: 'Mentorship',
    creatorName: 'David Vance',
    creatorRole: 'Principal Engineer at Stripe',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    companyOrOrg: 'Tech Mentors Alliance',
    description: 'Offering 1-on-1 monthly mentorship slots for 3 motivated computer science students focusing on distributed systems and backend engineering.',
    tags: ['Career Mentorship', 'Distributed Systems', '1-on-1 Sessions'],
    targetAudiences: ['Students'],
    location: 'Remote (Google Meet)',
    linkText: 'Request Mentorship Slot',
    createdAt: '2025-02-12T14:30:00.000Z'
  },
  {
    id: 'opp_3',
    title: 'Developer Cloud Platform Creator Sponsorships ($2k - $8k)',
    type: 'Brand Partnership',
    creatorName: 'Lumina Cloud',
    creatorRole: 'Developer Marketing Team',
    creatorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    companyOrOrg: 'Lumina Cloud',
    description: 'Seeking technical creators (YouTube, Substack, podcasts) with audiences of 10k-500k developers for authentic product walkthroughs and build tutorials.',
    tags: ['Sponsorship', 'Creator Economy', 'Developer Tools', 'Paid Campaign'],
    targetAudiences: ['Creators'],
    location: 'Worldwide',
    linkText: 'Pitch Collaboration',
    createdAt: '2025-02-14T09:00:00.000Z'
  },
  {
    id: 'opp_4',
    title: 'University Campus Ambassador Program — Fall 2026',
    type: 'Campus Activation',
    creatorName: 'Elena Rostova',
    creatorRole: 'Founder @ SynthAI',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    companyOrOrg: 'SynthAI',
    description: 'Empower your university AI/CS club with free API credits, exclusive workshop curriculum, and swags. Direct access to our engineering team.',
    tags: ['Campus Lead', 'Hackathons', 'API Credits', 'Student Clubs'],
    targetAudiences: ['Students', 'Communities'],
    location: 'Select Universities',
    linkText: 'Join Campus Program',
    createdAt: '2025-02-16T11:00:00.000Z'
  }
];
