require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SavedJob = require('./models/SavedJob');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await SavedJob.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Creating demo users...');
    
    // 1. Admin
    const admin = await User.create({
      name: 'HireHub Administrator',
      email: 'admin@hirehub.com',
      password: 'password123',
      role: 'admin',
      bio: 'System Administrator managing the HireHub hiring ecosystem.',
      location: 'Bengaluru, India'
    });

    // 2. Recruiters
    const recruiter1 = await User.create({
      name: 'Vikram Sharma',
      email: 'recruiter@hirehub.com',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      bio: 'Talent Acquisition Lead specializing in Full-Stack Engineering and Cloud Systems.'
    });

    const recruiter2 = await User.create({
      name: 'Ananya Roy',
      email: 'ananya@techcorp.com',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 98111 22334',
      location: 'Gurugram, India',
      bio: 'Senior HR Manager building scalable tech teams across APAC.'
    });

    const recruiter3 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan@fintechlab.io',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 97222 33445',
      location: 'Mumbai, India',
      bio: 'Head of People Operations at FinTech Solutions.'
    });

    // 3. Job Seekers
    const seeker1 = await User.create({
      name: 'Aarav Patel',
      email: 'seeker@hirehub.com',
      password: 'password123',
      role: 'jobseeker',
      phone: '+91 99887 76655',
      location: 'Bengaluru, India',
      bio: 'Passionate Full Stack Developer with 3+ years of experience in React, Node.js, Express, and MongoDB.',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'REST API', 'Docker'],
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'National Institute of Technology, Karnataka',
          fieldOfStudy: 'Computer Science & Engineering',
          startYear: '2019',
          endYear: '2023',
          grade: '8.8 CGPA'
        }
      ],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'CloudMatrix Innovations',
          location: 'Bengaluru',
          startDate: '2023-06',
          endDate: 'Present',
          currentlyWorking: true,
          description: 'Developed responsive user interfaces with React and Tailwind CSS. Improved page speed performance by 35%.'
        }
      ],
      projects: [
        {
          title: 'E-Commerce Platform API',
          description: 'Microservice-based backend with JWT authentication, Stripe integration, and Redis caching.',
          link: 'https://github.com/aaravpatel/ecommerce-api',
          technologies: ['Node.js', 'Express', 'MongoDB', 'Redis']
        }
      ]
    });

    const seeker2 = await User.create({
      name: 'Priya Verma',
      email: 'priya.verma@gmail.com',
      password: 'password123',
      role: 'jobseeker',
      phone: '+91 98333 44556',
      location: 'Hyderabad, India',
      bio: 'UI/UX Designer and Frontend Specialist focused on accessible modern web products.',
      skills: ['UI/UX Design', 'Figma', 'React.js', 'Tailwind CSS', 'HTML5/CSS3', 'Framer Motion']
    });

    console.log('[Seed] Creating demo companies...');

    const company1 = await Company.create({
      name: 'InnovateX Technologies',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      description: 'InnovateX is a global leader in cloud SaaS solutions, AI automation, and web platforms.',
      website: 'https://innovatex.tech',
      industry: 'Information Technology',
      location: 'Bengaluru, India',
      size: '500-1000',
      recruiter: recruiter1._id
    });

    const company2 = await Company.create({
      name: 'Apex Digital Labs',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=120&q=80',
      description: 'Apex Digital Labs delivers enterprise software solutions, fintech engines, and digital products.',
      website: 'https://apexdigital.com',
      industry: 'Software Development',
      location: 'Gurugram, India',
      size: '100-250',
      recruiter: recruiter2._id
    });

    const company3 = await Company.create({
      name: 'PayNext Financials',
      logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=120&q=80',
      description: 'Next-generation payment processor and UPI infrastructure builder.',
      website: 'https://paynext.io',
      industry: 'Fintech',
      location: 'Mumbai, India',
      size: '250-500',
      recruiter: recruiter3._id
    });

    console.log('[Seed] Creating 15 realistic job listings...');

    const jobsData = [
      {
        title: 'Senior Full Stack Engineer (MERN)',
        company: company1._id,
        recruiter: recruiter1._id,
        location: 'Bengaluru, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        salaryMin: 1800000,
        salaryMax: 2800000,
        experience: '3-5 Years',
        skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Docker'],
        vacancies: 3,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'We are seeking an experienced Senior Full Stack Engineer to lead the architecture and deployment of our cloud management web platform.',
        responsibilities: [
          'Design and implement high-performance REST APIs and microservices',
          'Build responsive dynamic UI frontends using React and modern CSS framework',
          'Optimize MongoDB queries and index strategies for high transaction volume',
          'Mentor junior software developers and conduct detailed code reviews'
        ],
        requirements: [
          '3+ years of professional backend & frontend web development',
          'Strong proficiency in JavaScript/TypeScript, React, Node.js, Express',
          'Experience with Docker, CI/CD pipelines, and AWS deployment'
        ],
        benefits: [
          'Competitive CTC with performance bonuses & equity options',
          'Flexible hybrid work schedule and remote allowances',
          'Comprehensive health insurance for employee & family'
        ]
      },
      {
        title: 'Frontend React Developer',
        company: company1._id,
        recruiter: recruiter1._id,
        location: 'Remote',
        jobType: 'Full Time',
        workMode: 'Remote',
        salaryMin: 1200000,
        salaryMax: 1800000,
        experience: '2-4 Years',
        skills: ['React.js', 'Tailwind CSS', 'Redux / Context', 'REST API', 'Framer Motion'],
        vacancies: 2,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Join our design-focused frontend team building sleek, interactive dashboards for enterprise analytics.',
        responsibilities: [
          'Translate Figma design mockups into pixel-perfect React components',
          'Maintain design system tokens and reusable component libraries',
          'Ensure cross-browser responsiveness and accessibility standards'
        ],
        requirements: [
          'Proficiency in React.js, Tailwind CSS, and state management',
          'Solid understanding of HTTP REST APIs and JSON integration'
        ],
        benefits: ['100% Work from home setup allowance', 'Learning & Certification stipends']
      },
      {
        title: 'Backend Node.js Engineer',
        company: company2._id,
        recruiter: recruiter2._id,
        location: 'Gurugram, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        salaryMin: 1500000,
        salaryMax: 2200000,
        experience: '3+ Years',
        skills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'PostgreSQL', 'System Design'],
        vacancies: 4,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Looking for a robust Backend Developer to scale core transaction processing APIs.',
        responsibilities: [
          'Build scalable web server APIs with Node.js & Express',
          'Architect database schemas and implement caching layers with Redis'
        ],
        requirements: ['3+ years experience with Node.js backends and MongoDB/SQL databases'],
        benefits: ['Free lunch & snacks', 'Wellness allowance']
      },
      {
        title: 'DevOps & Cloud Engineer',
        company: company2._id,
        recruiter: recruiter2._id,
        location: 'Gurugram, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        salaryMin: 2000000,
        salaryMax: 3000000,
        experience: '4+ Years',
        skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
        vacancies: 1,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Automate deployment pipelines and manage Kubernetes clusters in AWS cloud.',
        responsibilities: ['Maintain infrastructure-as-code and zero-downtime deployment pipelines'],
        requirements: ['Hands-on experience with AWS, Kubernetes, Terraform'],
        benefits: ['Annual company retreat', 'Comprehensive health coverage']
      },
      {
        title: 'Product Designer (UI/UX)',
        company: company3._id,
        recruiter: recruiter3._id,
        location: 'Mumbai, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        salaryMin: 1400000,
        salaryMax: 2000000,
        experience: '2-4 Years',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
        vacancies: 2,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Craft intuitive mobile and web payment journeys for millions of users.',
        responsibilities: ['Create user wireframes, interactive prototypes, and design systems'],
        requirements: ['Strong portfolio showcasing user-centered product design work'],
        benefits: ['MacBook Pro equipment', 'Flexible hours']
      },
      {
        title: 'Lead QA Automation Engineer',
        company: company3._id,
        recruiter: recruiter3._id,
        location: 'Mumbai, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        salaryMin: 1600000,
        salaryMax: 2400000,
        experience: '5+ Years',
        skills: ['Cypress', 'Playwright', 'Selenium', 'JavaScript', 'API Testing'],
        vacancies: 2,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Build end-to-end automation test suites for web applications and payment APIs.',
        responsibilities: ['Establish QA processes, automated test coverage, and regression suites'],
        requirements: ['Deep expertise in Playwright/Cypress automation framework'],
        benefits: ['Health & Life insurance', 'Incentive bonus']
      },
      {
        title: 'Full Stack Development Intern',
        company: company1._id,
        recruiter: recruiter1._id,
        location: 'Bengaluru, India',
        jobType: 'Internship',
        workMode: 'Hybrid',
        salaryMin: 300000,
        salaryMax: 500000,
        experience: 'Fresher',
        skills: ['JavaScript', 'React.js', 'Node.js', 'Git', 'HTML/CSS'],
        vacancies: 5,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Accelerated 6-month internship program with direct mentorship and PPO potential.',
        responsibilities: ['Build minor UI features and fix client bug tickets under senior guidance'],
        requirements: ['Pre-final or final year CS students with strong foundation in JavaScript'],
        benefits: ['Monthly stipend of ₹30,000 - ₹40,000', 'Certificate of Completion']
      },
      {
        title: 'Python Data Engineer',
        company: company2._id,
        recruiter: recruiter2._id,
        location: 'Remote',
        jobType: 'Full Time',
        workMode: 'Remote',
        salaryMin: 1700000,
        salaryMax: 2500000,
        experience: '3+ Years',
        skills: ['Python', 'PySpark', 'SQL', 'Snowflake', 'Airflow'],
        vacancies: 2,
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Architect data pipelines for analytics dashboards and machine learning models.',
        responsibilities: ['Build ETL pipelines with Airflow, PySpark, and Snowflake'],
        requirements: ['Strong mastery of SQL, Python, and big data pipeline concepts'],
        benefits: ['Global remote work setup', 'Wellness stipend']
      },
      {
        title: 'Mobile App Developer (React Native)',
        company: company3._id,
        recruiter: recruiter3._id,
        location: 'Mumbai, India',
        jobType: 'Contract',
        workMode: 'Remote',
        salaryMin: 1200000,
        salaryMax: 1800000,
        experience: '2+ Years',
        skills: ['React Native', 'iOS', 'Android', 'Redux Toolkit', 'REST API'],
        vacancies: 1,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: '6-month contract role building cross-platform iOS and Android payment wallet features.',
        responsibilities: ['Develop clean React Native features with smooth native animations'],
        requirements: ['Published React Native apps on Play Store or App Store'],
        benefits: ['Hourly compensation contract with flexible schedules']
      },
      {
        title: 'Cybersecurity Analyst',
        company: company3._id,
        recruiter: recruiter3._id,
        location: 'Mumbai, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        salaryMin: 1800000,
        salaryMax: 2600000,
        experience: '4+ Years',
        skills: ['Penetration Testing', 'OWASP', 'SIEM', 'Network Security', 'SOC'],
        vacancies: 1,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Protect financial infrastructure from security vulnerabilities and audit threats.',
        responsibilities: ['Perform penetration tests, vulnerability scans, and security patch audits'],
        requirements: ['CEH, CISSP, or equivalent security certifications'],
        benefits: ['Security training budget', 'Comprehensive insurance']
      },
      {
        title: 'Technical Technical Writer',
        company: company1._id,
        recruiter: recruiter1._id,
        location: 'Remote',
        jobType: 'Part Time',
        workMode: 'Remote',
        salaryMin: 400000,
        salaryMax: 700000,
        experience: '1-3 Years',
        skills: ['Technical Writing', 'Markdown', 'API Documentation', 'GitBook'],
        vacancies: 1,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Document REST API endpoints, developer guides, and SDK reference manuals.',
        responsibilities: ['Author clear developer documentation and interactive API code snippets'],
        requirements: ['Ability to read JavaScript/JSON code and translate into clear documentation'],
        benefits: ['Flexible part-time hours']
      },
      {
        title: 'AI / Machine Learning Engineer',
        company: company1._id,
        recruiter: recruiter1._id,
        location: 'Bengaluru, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        salaryMin: 2200000,
        salaryMax: 3500000,
        experience: '3+ Years',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'LangChain', 'FastAPI'],
        vacancies: 2,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Integrate LLMs, AI search agents, and vector databases into web products.',
        responsibilities: ['Fine-tune open-source models and deploy FastAPI inference services'],
        requirements: ['Mastery of PyTorch, vector databases (Pinecone/Milvus), and LLM frameworks'],
        benefits: ['Generous RSU equity options', 'GPU cluster access']
      },
      {
        title: 'Scrum Master / Agile Project Manager',
        company: company2._id,
        recruiter: recruiter2._id,
        location: 'Gurugram, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        salaryMin: 1500000,
        salaryMax: 2200000,
        experience: '4+ Years',
        skills: ['Agile', 'Scrum', 'Jira', 'Kanban', 'Sprint Planning'],
        vacancies: 1,
        deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Facilitate sprint planning, daily standups, and retrospective meetings for engineering squads.',
        responsibilities: ['Remove team blockers and track sprint velocity in Jira'],
        requirements: ['Certified Scrum Master (CSM) certification'],
        benefits: ['Generous annual leave policy', 'Team outing events']
      },
      {
        title: 'System Administrator & IT Support',
        company: company2._id,
        recruiter: recruiter2._id,
        location: 'Gurugram, India',
        jobType: 'Full Time',
        workMode: 'On-site',
        salaryMin: 800000,
        salaryMax: 1200000,
        experience: '2+ Years',
        skills: ['Linux', 'Windows Server', 'Active Directory', 'Networking', 'Hardware Support'],
        vacancies: 2,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Manage internal company network, laptop onboarding, and office IT infrastructure.',
        responsibilities: ['Manage user accounts, VPN connections, and hardware inventory'],
        requirements: ['Working knowledge of Linux/Windows server administration'],
        benefits: ['Overtime allowance', 'Health coverage']
      },
      {
        title: 'Product Marketing Manager',
        company: company3._id,
        recruiter: recruiter3._id,
        location: 'Mumbai, India',
        jobType: 'Full Time',
        workMode: 'Hybrid',
        salaryMin: 1600000,
        salaryMax: 2400000,
        experience: '3+ Years',
        skills: ['Product Marketing', 'Growth', 'Content Strategy', 'SEO', 'Google Analytics'],
        vacancies: 1,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Active',
        description: 'Lead product launches, go-to-market strategies, and user acquisition campaigns.',
        responsibilities: ['Drive product positioning, messaging, and feature release collateral'],
        requirements: ['3+ years product marketing experience in B2B SaaS or Fintech'],
        benefits: ['Performance bonus', 'Flexible work arrangements']
      }
    ];

    const createdJobs = await Job.insertMany(jobsData);

    console.log('[Seed] Creating demo applications...');

    await Application.create([
      {
        job: createdJobs[0]._id, // Senior Full Stack Engineer
        applicant: seeker1._id,
        recruiter: recruiter1._id,
        resume: '/uploads/sample_resume_aarav.pdf',
        coverLetter: 'I have 3+ years experience developing high quality React & Node.js web applications. I would love to join InnovateX.',
        status: 'Shortlisted'
      },
      {
        job: createdJobs[1]._id, // Frontend React Developer
        applicant: seeker2._id,
        recruiter: recruiter1._id,
        resume: '/uploads/sample_resume_priya.pdf',
        coverLetter: 'Passionate UI designer and React frontend builder. Check my design work and code projects.',
        status: 'Interview'
      },
      {
        job: createdJobs[6]._id, // Full Stack Intern
        applicant: seeker1._id,
        recruiter: recruiter1._id,
        resume: '/uploads/sample_resume_aarav.pdf',
        coverLetter: 'Excited about full stack engineering.',
        status: 'Applied'
      }
    ]);

    console.log('[Seed] Creating demo saved jobs and notifications...');

    await SavedJob.create([
      { user: seeker1._id, job: createdJobs[0]._id },
      { user: seeker1._id, job: createdJobs[1]._id },
      { user: seeker1._id, job: createdJobs[11]._id }
    ]);

    await Notification.create([
      {
        user: seeker1._id,
        title: 'Application Shortlisted!',
        message: 'Your application for "Senior Full Stack Engineer (MERN)" at InnovateX Technologies has been shortlisted.',
        type: 'application_status'
      },
      {
        user: seeker1._id,
        title: 'Welcome to HireHub',
        message: 'Complete your profile to increase visibility to top tech recruiters.',
        type: 'system'
      }
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ SEED SUCCESSFUL! Demo accounts created:');
    console.log('  Job Seeker: seeker@hirehub.com / password123');
    console.log('  Recruiter:  recruiter@hirehub.com / password123');
    console.log('  Admin:      admin@hirehub.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
